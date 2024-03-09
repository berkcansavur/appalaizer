import * as fs from 'fs'
import * as path from 'path';
export class Config {
  private static AIEngine: string = ''
  private static language: string = 'en'
  private static apiKeyPath = path.join(__dirname, '..', '..', 'src', 'constants', 'apikeys.txt');
  static setApiKey(apiKey: string): void {
    const content = `openapiKey = '${apiKey}'`;
    fs.writeFileSync(this.apiKeyPath, content);
  }

  static getApiKey(): string | null {
    try {
      const content = fs.readFileSync(this.apiKeyPath, 'utf8');
      if (content.length < 5) {
        return null;
      } else {
        const matches = content.match(/openapiKey = '(.*)'/);
        return matches ? matches[1] : null;
      }
    } catch (error) {
      console.error('An error occurred while fetching openapi key:', error);
      return null;
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
