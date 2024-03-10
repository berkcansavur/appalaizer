import { Languages } from '../constants'
import { InvalidApiKeyError, BaseError, FileNotFoundException } from '../common/exceptions'
import { ConfigLogic, ErrorLogic } from '../common/logic'
import * as fs from 'fs'
import * as path from 'path'

export class Config {
  private static AIEngine: string = ''
  private static language: string = Languages.English
  private static apiKeyPath = path.join(
    __dirname,
    '..',
    '..',
    'src',
    'constants',
    'apikeys.txt',
  )

  static setApiKey(apiKey: string): void {
    if (!ConfigLogic.isApiKeyValid(apiKey)) {
      throw new InvalidApiKeyError()
    }
    const content = `openapiKey = '${apiKey}'`
    fs.writeFileSync(this.apiKeyPath, content)
  }

  static getApiKey(): string | null {
    try {
      if (!fs.existsSync(this.apiKeyPath)) {
        fs.writeFileSync(this.apiKeyPath,'')
      }
      const content = fs.readFileSync(this.apiKeyPath, 'utf8')
      if (!ConfigLogic.isApiKeyValid(content)) {
        return null;
      } else {
        const matches = content.match(/openapiKey = '(.*)'/)
        return matches ? matches[1] : null
      }
    } catch (error) {
      if (ErrorLogic.isNoEntityError(error)
      ) {
        if (ErrorLogic.isFileNotFound(error)) {
          throw new FileNotFoundException(this.apiKeyPath)
        }
        throw error
      } else {
        throw error
      }
    }
  }

  static setEngine(AIEngine: string): void {
    this.AIEngine = AIEngine
  }

  static getEngine(): string {
    return this.AIEngine
  }

  static setLanguage(language: string): void {
    this.language = language
  }

  static getLanguage(): string {
    return this.language
  }
}
