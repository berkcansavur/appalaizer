export class Config {
  private static apiKey: string | null = null;

  static setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  static getApiKey(): string | null {
    return this.apiKey;
  }
}
