import { Configuration, OpenAIApi } from 'openai';
import {
  completionParams,
} from '../constant';
import { generatePrompt } from '../prompt';

/**
 * OpenAI Factory
 * Usage:
 * const openai = new OpenAIFactory();
 * const result = await openai.run({ filePath });
 */
class OpenAIFactory {
  private configuration: Configuration;
  private openai: OpenAIApi;

  constructor() {
    console.log(
      'OpenAIFactory Started, your ai model is: ',
      completionParams.model
    );

    // Check if the OPENAI_API_KEY environment variable is set
    if (!process.env.OPENAI_API_KEY) {
      console.error('Error: OPENAI_API_KEY environment variable is not set.');
      process.exit(1);
    }

    // Create a new OpenAI API client configuration
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    // Create a new OpenAI API client
    this.openai = new OpenAIApi(this.configuration);
  }

  /**
   * Generate prompt for the OpenAI API
   */
  private generatePrompt(filePath: string): string {
    // Set the file content as the prompt for the API request
    const prompt = `
      ${generatePrompt(filePath)}
      ###
    `;

    return prompt;
  }

  /**
   * Generate a test message using the OpenAI API
   */
  private async generateTestMessage(prompt: string): Promise<string> {
    // Create a new chat completion, using the GPT-3.5 Turbo model
    const completion = await this.openai.createCompletion({
      ...completionParams,
      prompt,
    });

    // Print the message generated by the API
    const result = completion.data.choices[0].text;
    console.log('usage ===>', completion.data.usage);

    return result || '';
  }


  /**
   * Run the OpenAI API
   * @param filePath
   * @description filePath is the path of the file to be passed to the OpenAI API as the prompt
   * @returns {Promise<string>}
   */
  async run({ filePath }: { filePath: string }): Promise<string> {
    const prompt = this.generatePrompt(filePath);
    const message = await this.generateTestMessage(prompt);

    return message;
  }
}

export default OpenAIFactory;