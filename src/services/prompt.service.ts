import { ChatCompletionMessageParam } from 'openai/resources'
import {
  ABSTRACT_CLASS_PROMPT_PREFIX,
  analyzePrompt,
  CLASS_PROMPT_PREFIX,
  constructorPrompt,
  extensionPrompt,
  featurePrompt,
  FILE_EXTENSIONS,
  FileProperties,
  importsPrompt,
  IMPROVEMENTS_PROMPT_PREFIX,
  INTERFACE_PROMPT_PREFIX,
  investigationPrompt,
  Languages,
  PROMPTS,
  STRUCTURES_PROMPT,
  TYPE_PROMPT_PREFIX,
  userContentPrompt,
} from '../constants'
import { TranslationService } from './translation.service'
import { Config } from '../config'
import { GptService } from '../services'
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

  private generateContentPrompt(content: string): string {
    return `Below is a file with the content: \n${content}\n\n`
  }

  private generateProgrammingFileEntrancePrompt(
    fileProperties: FileProperties,
  ): string[] {
    const { dependencies, functionalities, content, extension, structs } =
      fileProperties
    const { constructorDependencies, importedDependencies } = dependencies || {}

    let constructorDependenciesText = ''
    let importDependenciesText = ''
    let functionalitiesText = ''
    let fileContentText = ''
    let fileExtensionText = ''

    if (functionalities && functionalities.length > 0) {
      functionalitiesText = functionalities.join(', ')
    } else {
      constructorDependenciesText = 'no functionalities'
    }

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
    const fileExtensionPrompt = extensionPrompt(fileExtensionText)
    const constructorDependenciesPrompt = constructorPrompt(
      constructorDependenciesText,
    )
    const importDependenciesPrompt = importsPrompt(importDependenciesText)

    let structPrompt = ''
    if (structs) {
      const { interfaces, classes, abstractClasses, types } = structs
      structPrompt = `${STRUCTURES_PROMPT}\n`
      if (interfaces && interfaces.length > 0) {
        structPrompt += `${INTERFACE_PROMPT_PREFIX} ${interfaces.join(', ')}\n`
      }
      if (classes && classes.length > 0) {
        structPrompt += `${CLASS_PROMPT_PREFIX} ${classes.join(', ')}\n`
      }
      if (abstractClasses && abstractClasses.length > 0) {
        structPrompt += `${ABSTRACT_CLASS_PROMPT_PREFIX} ${abstractClasses.join(', ')}\n`
      }
      if (types && types.length > 0) {
        structPrompt += `${TYPE_PROMPT_PREFIX} ${types.join(', ')}\n`
      }
    }
    const analysisPrompt = analyzePrompt(functionalitiesText)
    const improvementsPrompt = IMPROVEMENTS_PROMPT_PREFIX

    return [
      fileContentPrompt,
      structPrompt,
      fileExtensionPrompt,
      constructorDependenciesPrompt,
      importDependenciesPrompt,
      analysisPrompt,
      improvementsPrompt,
    ]
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
    const fileExtension = baseFileService.getExtension(fileContent)
    let prompts: string[]
    if (Object.values(FILE_EXTENSIONS).toString().includes(fileExtension)) {
      prompts = this.generateProgrammingFileEntrancePrompt(
        baseFileService.getFileProperties(fileContent, fileExtension),
      )
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
  private formatFeaturePrompt(
    fileContent: string,
    userContent: string,
  ): string[] {
    const investigationPromptText = investigationPrompt(fileContent)
    const userContentPromptText = userContentPrompt(userContent)
    const featurePromptText = featurePrompt(this.language)

    return [investigationPromptText, userContentPromptText, featurePromptText]
  }
  async generateFeaturePrompt(
    fileContent: string,
    userContent: string,
  ): Promise<string[]> {
    const prompts = this.formatFeaturePrompt(fileContent, userContent)
    if (this.language !== Languages.English) {
      return await this.translatePrompts(prompts, this.language)
    }
    return prompts
  }
}
