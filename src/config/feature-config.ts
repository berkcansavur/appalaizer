import * as path from 'path'
import * as fs from 'fs'
import { ErrorLogic, FileNotFoundException } from '../common'
export class FeatureConfig {
  private static featureContentPath = path.join(
    __dirname,
    '..',
    '..',
    'src',
    'constants',
    'features.txt',
  )
  constructor() {
    console.log('FeatureService')
  }

  static setFeatureContent(featureContent: string): void {
    fs.writeFileSync(this.featureContentPath, featureContent)
  }
  static getFeatureContent(): string {
    try {
      if (!fs.existsSync(this.featureContentPath)) {
        fs.writeFileSync(this.featureContentPath, '')
      }
      return fs.readFileSync(this.featureContentPath, 'utf8')
    } catch (error) {
      if (ErrorLogic.isFileNotFound(error)) {
        throw new FileNotFoundException(this.featureContentPath)
      }
      throw error
    }
  }
}
