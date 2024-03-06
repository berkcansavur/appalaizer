import { Config } from '../config';
import OpenAI from 'openai';

export class GptService {
  private openai: OpenAI | null = null;



  private async createOpenAiClient(): Promise<OpenAI> {
    const apiKey = Config.getApiKey();
    if (!apiKey) {
      throw new Error('GPT API Key is not provided.');
    } else {
      return new OpenAI({apiKey});
    }
  }

  public async generateGptResponse(prompt: string): Promise<string> {
    console.log('Prompt: ', prompt);
    try {
      if (!this.openai) {
        this.openai = await this.createOpenAiClient();
      }

      const response = await this.openai.chat.completions.create({
        messages: [
          { role: "user", content: prompt }
        ],
        model: "gpt-3.5-turbo-instruct",
        response_format: { type: "json_object" }
      });
      console.log(`Response: ${response.choices[0]}`)
      if (response.choices && response.choices.length > 0) {
        const completion = response.choices[0].message.content;
        if (!completion) {
          throw new Error(`Completion could not be created`);
        }
        return completion;
      } else {
        throw new Error('Invalid response received from OpenAI API.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error occurred';
      throw new Error(`An error occurred during OpenAI API request: ${errorMessage}`);
    }
  }
}
