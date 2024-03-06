import { Config } from './config';

export class ConfigSetup {
  static setApiKeyFromTerminal(): Promise<void> {
    return new Promise<void>((resolve) => {
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
  
      rl.question('Please enter your API key: ', (apiKey: string) => {
        Config.setApiKey(apiKey);
        console.log('API key has been set successfully.');
        rl.close();
        resolve();
      });
    });
  }
}
