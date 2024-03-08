import { ChatCompletionMessageParam } from 'openai/resources'
import { PROMPTS } from '../constants'
import { TranslationService } from './translation.service';
import { Config } from '../config';
import { GptService } from './gpt.service';

export class PromptService extends TranslationService{
  private language = Config.getLanguage();
  constructor(gptService: GptService) {
    super(gptService); // GptService örneğini TranslationService'e geçirin
  }
  async generateFileAnalyzePrompt(fileContent: string): Promise<string[]> {
    const enterencePromt = this.prepareContentPrompt(fileContent)
    const promtsArray: string[] = [
      enterencePromt + PROMPTS.FileAnalyze,
      PROMPTS.DependencyAnalyze,
      PROMPTS.ImprovementSuggestions,
      PROMPTS.GeneralAnalyzeFromGPTConversation,
    ]
    if (this.language !== 'English') {
      return await this.translatePromts(promtsArray, this.language);
    }
    return promtsArray;
  }
  preparePromptForGpt(promts: string[]): ChatCompletionMessageParam[] {
    return promts.map((prompt) => {
      const formattedPrompt: ChatCompletionMessageParam = {
        role: 'user',
        content: prompt,
      }
      return formattedPrompt
    })
  }
  prepareContentPrompt(fileContent: string): string {
    return `Öncelikle cevabını, ${this.language} dilinde oluştur. Aşağıda bir projenin içerdiği dosyalardan birisi mevcut: :\n${fileContent}\n\n `
  }
}
