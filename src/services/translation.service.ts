
import { GptService } from './gpt.service'

export class TranslationService {
  constructor(private readonly gptService: GptService) {}

  async translatePromts(prompts: string[] ,targetLanguage: string): Promise<string[]> {
    const translationPromises = prompts.map(prompt => this.translateText(prompt, targetLanguage));
    console.log('Translated Promts: ', JSON.stringify(translationPromises));
    return Promise.all(translationPromises);
  }
  private async translateText(
    text: string,
    targetLanguage: string,
  ): Promise<string> {
    const translationPrompt: string = `Translate the following text: ${text} to ${targetLanguage}:`

    try {
      return await this.gptService.gptTranslate(translationPrompt);
    } catch (error) {
      console.error('Error translating text:', error)
      throw error
    }
  }
}
