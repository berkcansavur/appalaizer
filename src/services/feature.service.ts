import { BaseFileService } from './files'
import { FeatureConfig } from '../config'
import { PromptService } from '../services/prompt.service'
import { GptService } from './gpt.service'
import * as path from 'path'
import { ChatCompletionMessageParam } from 'openai/resources'
import { ErrorLogic, RequestFailedException } from '../common'

export class FeatureService {
  private readonly fileService: BaseFileService
  private readonly promptService: PromptService
  private readonly gptService: GptService

  constructor(
    fileService: BaseFileService,
    promptService: PromptService,
    gptService: GptService,
  ) {
    this.fileService = fileService
    this.promptService = promptService
    this.gptService = gptService
  }

  async handleGPTPromptGeneration(inputPath: string, fileName: string) {
    const { promptService } = this
    const fileRealPath = path.join(inputPath, fileName)

    const userContent = FeatureConfig.getFeatureContent()
    const fileContent = this.fileService.read(fileRealPath)

    const featurePrompts = await promptService.generateFeaturePrompt(
      fileContent,
      userContent,
    )
    return this.promptService.preparePromptForGpt(featurePrompts)
  }
  private async sendFeatureRequest(
    prompts: ChatCompletionMessageParam[],
  ): Promise<string> {
    try {
      return this.gptService.generateGptResponse(prompts)
    } catch (error) {
      throw new RequestFailedException(ErrorLogic.errorProps(error))
    }
  }

  async handleFeatureGeneration(
    fileRealPath: string,
    fileName: string,
  ): Promise<string> {
    const gptPrompts = await this.handleGPTPromptGeneration(
      fileRealPath,
      fileName,
    )
    try {
      const response = await this.sendFeatureRequest(gptPrompts)
      if (response) {
        console.log(`Changes made in to the file is below here: ${response}`)
      }
      return response
    } catch (error) {
      throw error
    }
  }

  async commitChangesToFile(filePath: string, aiResult: string): Promise<void> {
    const { fileService } = this

    await fileService.writeAnalysisResult(filePath, aiResult)
  }
}
