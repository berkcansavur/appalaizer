export class ConfigLogic {
  static isApiKeyValid(key: string): boolean {
    return key.length > 6;
  }
}
