import { ChatCompletionMessageParam } from 'openai/resources'
import { Languages, PROMPTS } from '../constants'
import { TranslationService } from './translation.service'
import { Config } from '../config'
import { GptService } from './gpt.service'

export class PromptService extends TranslationService {
  private language = Config.getLanguage()
  constructor(gptService: GptService) {
    super(gptService)
  }
  private generateInitPrompt(fileContent: string): string {
    return `First, create your answer in ${this.language} language. Below is one of the files included in a project: \n${fileContent}\n\n`
  }

  private prepareContentPrompt(fileContent: string): string {
    return this.generateInitPrompt(fileContent)
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
    const entrancePrompt = this.prepareContentPrompt(fileContent)
    const promptsArray: string[] = [
      entrancePrompt + PROMPTS.FileAnalyze,
      PROMPTS.DependencyAnalyze,
      PROMPTS.ImprovementSuggestions,
      PROMPTS.GeneralAnalyzeFromGPTConversation,
    ]
    if (this.language !== Languages.English) {
      return await this.translatePrompts(promptsArray, this.language)
    }
    return promptsArray
  }
}
