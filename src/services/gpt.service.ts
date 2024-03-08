import { Config } from '../config'
import OpenAI from 'openai'
import { ChatCompletionMessageParam, Models } from 'openai/resources'

export class GptService {
  private openai: OpenAI | null = null

  private async createOpenAiClient(): Promise<OpenAI> {
    const apiKey = Config.getApiKey()
    if (!apiKey) {
      throw new Error('GPT API Key is not provided.')
    } else {
      return new OpenAI({ apiKey })
    }
  }
  public async listEngines(): Promise<string[]> {
    if (!this.openai) {
      await this.createOpenAiClient()
    }

    try {
      if (!this.openai) {
        this.openai = await this.createOpenAiClient()
      }
      const response = await this.openai.models.list()
      const engines = response.data.map((model) => model.id)
      console.log('Available engines:', engines)
      return engines
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        'Unknown error occurred'
      throw new Error(
        `An error occurred while listing engines: ${errorMessage}`,
      )
    }
  }
  public async gptTranslate(translationPrompt: string): Promise<string> {
    try {
      if (!this.openai) {
        this.openai = await this.createOpenAiClient()
      }
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: translationPrompt,
          },
        ],
      })
      if (response.choices && response.choices.length > 0) {
        const completion = response.choices[0].message.content
        if (!completion) {
          throw new Error(`Completion could not be created`)
        }
        console.log('Completion: ', completion);
        return completion;
      } else {
        throw new Error('Invalid response received from OpenAI API.')
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        'Unknown error occurred'
      throw new Error(
        `An error occurred during OpenAI API request: ${errorMessage}`,
      )
    }
  }

  public async generateGptResponse(
    prompts: ChatCompletionMessageParam[],
  ): Promise<string> {
    console.log('Prompt: ', JSON.stringify(prompts))
    try {
      if (!this.openai) {
        this.openai = await this.createOpenAiClient()
      }

      const response = await this.openai.chat.completions.create({
        messages: prompts,
        model: Config.getEngine(),
      })
      if (response.choices && response.choices.length > 0) {
        const completion = response.choices[0].message.content
        if (!completion) {
          throw new Error(`Completion could not be created`)
        }
        return completion
      } else {
        throw new Error('Invalid response received from OpenAI API.')
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        'Unknown error occurred'
      throw new Error(
        `An error occurred during OpenAI API request: ${errorMessage}`,
      )
    }
  }
}
