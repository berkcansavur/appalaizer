import { GptService } from 'services'
import { Config } from './config'
import * as readline from 'readline'

export class ConfigSetup {
  private rl: readline.Interface

  constructor(private readonly gptService: GptService) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  }

  async getEngineList() {
    try {
      return this.gptService.listEngines()
    } catch (error) {
      console.error('Error fetching engine list:', error)
    }
  }

  async setAnalyzeLanguageFromTerminal(): Promise<void> {
    const language: string = await new Promise((resolve) => {
      this.rl.question('Please enter language for analysis: ', (answer) => {
        resolve(answer)
      })
    })

    Config.setLanguage(language)
    console.log('Language has been set for analyze successfully.')
  }

  async setApiKeyFromTerminal(): Promise<void> {
    const apiKey: string = await new Promise((resolve) => {
      this.rl.question('Please enter your API key: ', (answer) => {
        resolve(answer)
      })
    })

    Config.setApiKey(apiKey)
    console.log('API key has been set successfully.')
  }

  async setAIEngineFromTerminal(): Promise<void> {
    await this.getEngineList()
    const AIEngine: string = await new Promise((resolve) => {
      this.rl.question(`Please type your Engine:`, (answer) => {
        resolve(answer)
      })
    })

    Config.setEngine(AIEngine)
    console.log('AI Engine has been set successfully.')
  }

  closeReadline() {
    this.rl.close()
  }
}
