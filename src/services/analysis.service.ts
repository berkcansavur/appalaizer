import { GptService } from 'services/gpt.service'
import * as fs from 'fs'
import * as path from 'path'
import { ProjectTreeService } from 'services/project-tree.service'
import { DefaultFileService } from 'services/default-file.service'
import { PromptService } from './prompt.service'
import { ChatCompletionMessageParam } from 'openai/resources'

export class AnalysisService {
  constructor(
    private readonly gptService: GptService,
    private readonly projectTreeService: ProjectTreeService,
    private readonly defaultFileService: DefaultFileService,
    private readonly promptService: PromptService,
  ) {}

  public async analyzeProjectFiles(projectPath: string): Promise<void> {
    try {
      const outputDir = path.join(projectPath, 'docs')
      this.projectTreeService.generateProjectTree(projectPath, outputDir)
      console.log('Project tree is generated and markdown files are created.')
      await this.analyzeFilesInOutputDirectory(outputDir)
    } catch (error) {
      console.error('An error occurred while analyzing project files.', error)
    }
  }

  private async analyzeFilesInOutputDirectory(
    outputDir: string,
  ): Promise<void> {
    try {
      if (!fs.existsSync(outputDir)) {
        console.error('Docs folder can not be found.')
        return
      }

      for (const folder of ['files', 'folders']) {
        const folderPath = path.join(outputDir, folder)
        if (!fs.existsSync(folderPath)) {
          console.error(`${folder} folder does not exist.`)
          continue
        }

        console.log(`Analyzing files in ${folder} folder...`)
        const files = fs.readdirSync(folderPath)
        console.log(
          `Files to be analyzed count in ${folder} folder: ${files.length}`,
        )
        for (const file of files) {
          const filePath = path.join(folderPath, file)
          console.log(`File path: ${filePath}`)
          if (filePath.endsWith('.md')) {
            const analysisResult = await this.analyzeFile(filePath)
            console.log(`File analysis is successful: ${filePath}`)
            console.log('Analysis Result:', analysisResult)
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
      console.error('Error occurred during file analysis:', error)
      throw error
    }
  }

  private async analyzeFile(filePath: string): Promise<string> {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8')
    const prompts = await this.promptService.generateFileAnalyzePrompt(fileContent)
    const formattedPromts = this.promptService.preparePromptForGpt(prompts)
    return await this.sendAnalyzeRequest(formattedPromts)
  }
  private async sendAnalyzeRequest(
    prompts: ChatCompletionMessageParam[],
  ): Promise<string> {
    return await this.gptService.generateGptResponse(prompts)
  }
}
