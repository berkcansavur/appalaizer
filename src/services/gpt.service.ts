import { ApiKeyException, ErrorLogic, OpenAIException } from '../common'
import { Config } from '../config'
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources'

export class GptService {
  private openai: OpenAI | null = null
  private async createOpenAiClient(): Promise<OpenAI> {
    const apiKey = Config.getApiKey()
    if(apiKey == null) {
      console.log('Your API key is invalid. Please set your OpenAI API key.')
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      const apiKey: string = await new Promise((resolve) => {
        readline.question('Please enter your API key: ', (answer: string) => {
          resolve(answer)
        })
      })

      Config.setApiKey(apiKey)
      console.log('API key has been set successfully.')
    }
    if (!apiKey) {
      throw new ApiKeyException();
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
      throw new OpenAIException(ErrorLogic.errorProps(error))
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
        return completion
      } else {
        throw new Error('Invalid response received from OpenAI API.')
      }
    } catch (error: any) {
      throw new OpenAIException(ErrorLogic.errorProps(error))
    }
  }

  public async generateGptResponse(
    prompts: ChatCompletionMessageParam[],
  ): Promise<string> {
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
      throw new OpenAIException(ErrorLogic.errorProps(error))
    }
  }
}
