import { GptService } from './gpt.service'
import { Languages } from '../constants'

export class TranslationService {
  private translationCache = new Map<string, string>()
  constructor(private readonly gptService: GptService) {}

  async translatePrompts(
    prompts: string[],
    targetLanguage: string,
  ): Promise<string[]> {
    return Promise.all(
      prompts.map(async (prompt) => {
        const cacheKey = `${prompt}-${targetLanguage}`
        if (this.translationCache.has(cacheKey)) {
          return this.translationCache.get(cacheKey)!
        } else {
          const translatedText = await this.translateText(
            prompt,
            targetLanguage,
          )
          this.translationCache.set(cacheKey, translatedText)
          return translatedText
        }
      }),
    )
  }
  private async translateText(
    text: string,
    targetLanguage: string,
  ): Promise<string> {
    const translationPrompt: string = `Translate the following text: ${text} to ${targetLanguage}:`

    try {
      return await this.gptService.gptTranslate(translationPrompt)
    } catch (error) {
      console.error('Error translating text:', error)
      throw error
    }
  }
}
