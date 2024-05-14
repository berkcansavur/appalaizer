import { ChatCompletionMessageParam } from 'openai/resources'
import {
  FILE_EXTENSIONS,
  FileProperties,
  Languages,
  PROMPTS,
} from '../constants'
import { TranslationService } from './translation.service'
import { Config } from '../config'
import { GptService } from './gpt.service'
import { BaseFileService } from './files'

export class PromptService extends TranslationService {
  private language = Config.getLanguage()
  private baseFileService
  constructor(gptService: GptService, baseFileService: BaseFileService) {
    super(gptService)
    this.baseFileService = baseFileService
  }
  private generateInitPrompt(fileContent: string): string {
    return `First, create your answer in ${this.language} language. Below is one of the files included in a project: \n${fileContent}\n\n`
  }

  private generateImportsPrompt(importDependenciesText: string): string {
    return `and here you will find a list of imported dependencies: ${importDependenciesText}.`
  }

  private generateContentPrompt(content: string): string {
    return `Below is a file with the content: \n${content}\n\n`
  }

  private generateProgrammingFileEntrancePrompt(
    fileProperties: FileProperties,
  ): string[] {
    const { dependencies, functionalities, content, extension } = fileProperties
    const { constructorDependencies, importedDependencies } = dependencies || {}

    let constructorDependenciesText = ''
    let importDependenciesText = ''
    let fileContentText = ''
    let fileExtensionText = ''
    if (constructorDependencies && constructorDependencies.length > 0) {
      constructorDependenciesText = constructorDependencies.join(', ')
    } else {
      constructorDependenciesText = 'no constructor dependencies'
    }

    if (importedDependencies && importedDependencies.length > 0) {
      importDependenciesText = importedDependencies.join(', ')
    } else {
      importDependenciesText = 'no import dependencies'
    }

    if (content && content.length > 0) {
      fileContentText = content
    } else {
      fileContentText = 'no content'
    }

    if (extension && extension.length > 0) {
      fileExtensionText = extension
    } else {
      fileExtensionText = 'no extension'
    }
    const fileContentPrompt = this.generateContentPrompt(fileContentText)
    const fileExtensionPrompt =
      this.generateFileExtensionPrompt(fileExtensionText)
    const constructorDependenciesPrompt = this.generateConstructorPrompt(
      constructorDependenciesText,
    )
    const importDependenciesPrompt = this.generateImportsPrompt(
      importDependenciesText,
    )
    const analysisPrompt = `Please analyze these dependencies along with the functionalities: ${functionalities} `
    const improvementsPrompt = `and share with me any possible improvements considering the overall structure of the code block.`

    return [
      fileContentPrompt,
      fileExtensionPrompt,
      constructorDependenciesPrompt,
      importDependenciesPrompt,
      analysisPrompt,
      improvementsPrompt,
    ]
  }

  private generateFileExtensionPrompt(extension: string): string {
    return `In this file, which has a ${extension} extension, `
  }

  private generateConstructorPrompt(
    constructorDependenciesText: string,
  ): string {
    return `you will find a list of constructor dependencies: ${constructorDependenciesText}.`
  }

  preparePromptForGpt(prompts: string[]): ChatCompletionMessageParam[] {
    return prompts.map((prompt) => {
      const formattedPrompt: ChatCompletionMessageParam = {
        role: 'user',
        content: prompt,
      }
      return formattedPrompt
    })
  }

  async generateFileAnalyzePrompt(fileContent: string): Promise<string[]> {
    const { baseFileService } = this
    const fileExtension = baseFileService.getFileExtension(fileContent)
    let prompts: string[]
    if (Object.values(FILE_EXTENSIONS).toString().includes(fileExtension)) {
      prompts = this.generateProgrammingFileEntrancePrompt(
        baseFileService.getFileProperties(fileContent, fileExtension),
      )
      console.log('Condition for fileExtension is provided.')
    }
    const entrancePrompt = this.generateInitPrompt(fileContent)
    prompts = [
      entrancePrompt + PROMPTS.FileAnalyze,
      PROMPTS.DependencyAnalyze,
      PROMPTS.ImprovementSuggestions,
      PROMPTS.GeneralAnalyzeFromGPTConversation,
    ]
    if (this.language !== Languages.English) {
      return await this.translatePrompts(prompts, this.language)
    }
    return prompts
  }
}
