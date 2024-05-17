import { BaseFileService, GptService } from 'services'
import { Config } from './config'
import * as readline from 'readline'
import { Languages, POSITIVE_ANSWERS } from '../constants'
import { FeatureConfig } from './feature-config'

export class ConfigSetup {
  private rl: readline.Interface
  private readonly fileService: BaseFileService
  constructor(
    private readonly gptService: GptService,
    fileService: BaseFileService,
  ) {
    this.fileService = fileService
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  }
  async setFeatureContentFromTerminal(): Promise<void> {
    const featureContent: string = await new Promise((resolve) => {
      this.rl.question(
        'Please enter your issue description with details: ',
        (answer) => {
          resolve(answer)
        },
      )
    })

    const isChecked: string = await new Promise((resolve) => {
      this.rl.question(
        `Your description is ${featureContent} \n are you sure before proceeding ? (y/n)`,
        (answer) => {
          resolve(answer)
        },
      )
    })
    if (Object.values(POSITIVE_ANSWERS).includes(isChecked)) {
      FeatureConfig.setFeatureContent(featureContent)
      console.log(
        'Your issue description is set for feature generation successfully.',
      )
    } else {
      await this.setFeatureContentFromTerminal()
    }
  }

  async getFileNameFromTerminal(directoryPath: string): Promise<string> {
    const filesInDirectory =
      this.fileService.listFilesInDirectory(directoryPath)
    console.log(`Available files can be modify are listed below: `)
    Object.entries(filesInDirectory).forEach((file) => {
      console.log(`- ${file}`)
    })
    const fileName: string = await new Promise((resolve) => {
      this.rl.question(
        'Please enter file name for feature generation: ',
        (answer) => {
          resolve(answer)
        },
      )
    })
    console.log('file is set for feature generation successfully.')

    return fileName
  }

  async commitChangesCheckFromTerminal(): Promise<boolean> {
    const isChecked: string = await new Promise((resolve) => {
      this.rl.question(
        'Are you accepting the changes on the file? (y/n) ',
        (answer) => {
          resolve(answer)
        },
      )
    })
    if (Object.values(POSITIVE_ANSWERS).includes(isChecked)) {
      console.log(
        'Your issue description is set for feature generation successfully.',
      )
      return true
    } else {
      return false
    }
  }

  async getEngineList() {
    try {
      return this.gptService.listEngines()
    } catch (error) {
      console.error('Error fetching engine list:', error)
    }
  }

  async setAnalyzeLanguageFromTerminal(): Promise<void> {
    const languagaes = Object.values(Languages)
    console.log(
      'Here is the list of languages that are available for analysis:',
      languagaes,
    )
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

  public closeReadline() {
    this.rl.close()
  }
}
