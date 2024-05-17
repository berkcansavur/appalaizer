import { COMMAND_DESCRIPTIONS } from '../constants'
import { ProjectTreeService } from './project-tree.service'
import * as path from 'path'
import { GptService } from './gpt.service'
import { AnalysisService } from './analysis.service'
import { BaseFileService } from './files/base-file.service'
import { PromptService } from './prompt.service'
import { Config, ConfigSetup } from '../config'
import { ErrorLogic, ProcessCouldNotSucceed } from '../common'
import { FeatureService } from './feature.service'

export class CommandLineService {
  constructor() {}

  async executeCommand(command: string) {
    switch (command) {
      case '--list':
        this.listBinCommands()
        break
      case '--analyze':
        await this.runAnalysis()
        break
      case '--md':
        this.runGeneratedProjectTree()
        break
      case '--api-key':
        await this.setApiKey()
        break
      case '--feature':
        await this.runFeature()
        break
      default:
        console.log(`"${command}" is not a recognized command.`)
        this.listBinCommands()
    }
  }
  async setApiKey() {
    const gptService = new GptService()
    const baseFileService = new BaseFileService()
    const configSetup = new ConfigSetup(gptService, baseFileService)
    await configSetup.setApiKeyFromTerminal()
    configSetup.closeReadline()
  }
  runGeneratedProjectTree() {
    const inputPath = process.cwd()
    const outputDir = path.join(inputPath, 'docs')
    const projectTreeService = new ProjectTreeService()
    projectTreeService.generateProjectTree(inputPath, outputDir)

    console.log('Project tree generated successfully.')
  }
  async analyzeProjectFiles() {
    const baseFileService = new BaseFileService()
    const gptService = new GptService()
    const configSetup = new ConfigSetup(gptService, baseFileService)
    if (Config.getApiKey() === null) {
      await configSetup.setApiKeyFromTerminal()
    }

    await configSetup.setAIEngineFromTerminal()
    await configSetup.setAnalyzeLanguageFromTerminal()
    const projectPath = process.cwd()
    const analysisService = new AnalysisService(
      gptService,
      new ProjectTreeService(),
      baseFileService,
      new PromptService(gptService, baseFileService),
    )

    try {
      await analysisService.analyzeProjectFiles(projectPath)
    } catch (error) {
      throw new ProcessCouldNotSucceed(
        'Analyzing project files',
        ErrorLogic.errorProps(error),
      )
    } finally {
      configSetup.closeReadline()
    }
  }

  async runAnalysis() {
    try {
      await this.analyzeProjectFiles()
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }

  listBinCommands() {
    console.log(
      'Available commands of the appalaizer package are listed below:',
    )
    const longestCommandLength = Math.max(
      ...Object.keys(COMMAND_DESCRIPTIONS).map((command) => command.length),
    )

    Object.entries(COMMAND_DESCRIPTIONS).forEach(([command, description]) => {
      const padding = ' '.repeat(longestCommandLength - command.length)
      console.log(`${command}:${padding}  ${description}`)
    })
  }

  async runFeature() {
    try {
      const inputPath = process.cwd()
      const gptService = new GptService()
      const baseFileService = new BaseFileService()
      const configSetup = new ConfigSetup(gptService, baseFileService)
      const promptService = new PromptService(gptService, baseFileService)
      if (Config.getApiKey() === null) {
        await configSetup.setApiKeyFromTerminal()
      }

      await configSetup.setAIEngineFromTerminal()
      await configSetup.setAnalyzeLanguageFromTerminal()
      const fileName = await configSetup.getFileNameFromTerminal(inputPath)
      await configSetup.setFeatureContentFromTerminal()

      const featureService = new FeatureService(
        baseFileService,

        promptService,
        gptService,
      )
      const generatedFeature = await featureService.handleFeatureGeneration(
        inputPath,
        fileName,
      )
      let isChecked = false
      if (generatedFeature) {
        isChecked = await configSetup.commitChangesCheckFromTerminal()
      }
      if (isChecked) {
        const fileRealPath = path.join(inputPath, fileName)
        const formattedFeature =
          baseFileService.removeCodeBlocks(generatedFeature)
        await featureService.commitChangesToFile(fileRealPath, formattedFeature)
      }
    } catch (error) {
      console.error('An error occurred while generating feature:', error)
    }
  }
}
