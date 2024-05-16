import * as readline from 'readline'
import { FeatureConfig } from '../config'
import { POSITIVE_ANSWERS } from '../constants'
import { BaseFileService } from '../services'
export class FeatureConfigSetup {
  private rl: readline.Interface
  private readonly fileService: BaseFileService
  constructor(fileService: BaseFileService) {
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
}
