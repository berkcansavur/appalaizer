import { COMMAND_DESCRIPTIONS } from '../constants'
import { ProjectTreeService } from './project-tree.service'
import * as path from 'path'
import { GptService } from './gpt.service'
import { AnalysisService } from './analysis.service'
import { DefaultFileService } from './default-file.service'
import { PromptService } from './prompt.service'
import { Config, ConfigSetup } from '../config'

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
      default:
        console.log(`"${command}" is not a recognized command.`)
        this.listBinCommands()
    }
  }
  runGeneratedProjectTree() {
    const inputPath = process.cwd()
    const outputDir = path.join(inputPath, 'docs')
    const projectTreeService = new ProjectTreeService()
    projectTreeService.generateProjectTree(inputPath, outputDir)

    console.log('Project tree generated successfully.')
  }
  async analyzeProjectFiles() {
    const configSetup = new ConfigSetup(new GptService())
    if (Config.getApiKey() === null) {
      await configSetup.setApiKeyFromTerminal()
    }

    await configSetup.setAIEngineFromTerminal()
    await configSetup.setAnalyzeLanguageFromTerminal()
    const gptService = new GptService()
    const projectPath = process.cwd()
    const analysisService = new AnalysisService(
      gptService,
      new ProjectTreeService(),
      new DefaultFileService(),
      new PromptService(gptService),
    )

    try {
      await analysisService.analyzeProjectFiles(projectPath)
    } catch (error) {
      console.error(`An error occurred: ${error}`)
    } finally {
      configSetup.closeReadline()
    }
  }

  async runAnalysis() {
    try {
      await this.analyzeProjectFiles()
    } catch (error) {
      console.error('Error occurred during project analysis:', error)
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
}
