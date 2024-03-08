export class Config {
  private static apiKey: string | null = null;
  private static AIEngine: string = '';
  private static language: string = 'en';

  static setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  static getApiKey(): string | null {
    return this.apiKey;
  }

  static setEngine(AIEngine: string): void {
    this.AIEngine = AIEngine;
  }

  static getEngine(): string {
    return this.AIEngine;
  }

  static setLanguage(language: string): void {
    this.language = language;
  }

  static getLanguage(): string {
    return this.language;
  }
}
