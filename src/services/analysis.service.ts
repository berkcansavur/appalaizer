import { GptService } from 'services/gpt.service'
import * as fs from 'fs'
import * as path from 'path'
import { ProjectTreeService } from 'services/project-tree.service'
import { BaseFileService } from 'services/files'
import { PromptService } from './prompt.service'
import { ChatCompletionMessageParam } from 'openai/resources'
import { ignoreList } from '../constants'
import {
  ErrorLogic,
  FolderNotFoundException,
  ProcessCouldNotSucceed,
  RequestFailedException,
} from '../common'

export class AnalysisService {
  constructor(
    private readonly gptService: GptService,
    private readonly projectTreeService: ProjectTreeService,
    private readonly defaultFileService: BaseFileService,
    private readonly promptService: PromptService,
  ) {}

  public async analyzeProjectFiles(projectPath: string): Promise<void> {
    try {
      const outputDir = path.join(projectPath, 'docs')
      this.projectTreeService.generateProjectTree(projectPath, outputDir)
      console.log('Project tree is generated and markdown files are created.')
      await this.analyzeFilesInOutputDirectory(outputDir)
    } catch (error) {
      throw new ProcessCouldNotSucceed(
        'Creating project tree',
        ErrorLogic.errorProps(error),
      )
    }
  }

  private async analyzeFilesInOutputDirectory(
    outputDir: string,
  ): Promise<void> {
    try {
      if (!fs.existsSync(outputDir)) {
        throw new FolderNotFoundException(outputDir)
      }

      for (const folder of ['files', 'folders']) {
        const folderPath = path.join(outputDir, folder)
        if (!fs.existsSync(folderPath)) {
          console.log(
            `${folder} folder does not exist in ${outputDir}, skipping.`,
          )
          continue
        }

        console.log(`Analyzing files in ${folder} folder...`)
        const files = fs.readdirSync(folderPath)
        const filesToAnalyze = files.filter(
          (file) => !ignoreList.includes(file),
        )
        console.log(
          `Files to be analyzed count in ${folder} folder: ${files.length}`,
        )
        for (const file of filesToAnalyze) {
          const filePath = path.join(folderPath, file)
          console.log(`Analyzing the path: ${filePath}`)
          console.log('...')
          if (filePath.endsWith('.md')) {
            const analysisResult = await this.analyzeFile(filePath)
            console.log(`File analysis of ${filePath} direcory is successful`)
            console.log(`Analysis writing to the file ${filePath}.`)
            await this.defaultFileService.writeAnalysisResultToFile(
              filePath,
              analysisResult,
            )
          }
        }
      }
      console.log('Analysis of project files is done successfully.')
    } catch (error) {
      throw new ProcessCouldNotSucceed(
        'Analyzing project files',
        ErrorLogic.errorProps(error),
      )
    }
  }

  private async analyzeFile(filePath: string): Promise<string> {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8')
    const prompts =
      await this.promptService.generateFileAnalyzePrompt(fileContent)
    const formattedPromts = this.promptService.preparePromptForGpt(prompts)
    return await this.sendAnalyzeRequest(formattedPromts)
  }

  private async sendAnalyzeRequest(
    prompts: ChatCompletionMessageParam[],
  ): Promise<string> {
    try {
      return this.gptService.generateGptResponse(prompts)
    } catch (error) {
      throw new RequestFailedException(ErrorLogic.errorProps(error))
    }
  }
}
