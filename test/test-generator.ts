import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';
import path from 'path';
import {
  completionParams,
  TEST_DIR_NAME,
  TEST_FILE_NAME_EXTENSION,
} from './constant';

class TestGenerator {
  private configuration: Configuration;
  private openai: OpenAIApi;

  constructor() {
    console.log(
      'TestGenerator Started, your ai model is: ',
      completionParams.model
    );
    // Create a new OpenAI API client configuration
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    // Create a new OpenAI API client
    this.openai = new OpenAIApi(this.configuration);
  }

  private getFileNameWithoutExtension(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }

  /**
   * Generate prompt for the OpenAI API
   */
  private async generatePrompt(filePath: string): Promise<string> {
    // Read the file contents using the fs module
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const fileName = this.getFileNameWithoutExtension(filePath);

    // Set the file content as the prompt for the API request
    const prompt = `
      Write a TypeScript unit test for the following function:
      ${fileContent}
      The test should import the function from "../${fileName}".
      Test case:
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
   * Write a test message to a file
   */
  private async writeTestMessageToFile(
    filePath: string,
    message: string
  ): Promise<void> {
    // Write the message to a file
    try {
      const dirPath = path.join(path.dirname(filePath), TEST_DIR_NAME);
      const fileName =
        this.getFileNameWithoutExtension(filePath) + TEST_FILE_NAME_EXTENSION;

      // Create the output directory if it doesn't exist
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }

      // Write the message to the output file
      fs.writeFileSync(path.join(dirPath, fileName), message);
      console.log('Message written to file');
    } catch (error) {
      console.error('Error writing message to file:', error);
    }
  }

  /**
   * Generate a test case for a given file
   */
  async generateTestCase({ filePath }: { filePath: string }): Promise<void> {
    const prompt = await this.generatePrompt(filePath);
    const message = await this.generateTestMessage(prompt);
    await this.writeTestMessageToFile(filePath, message);
  }
}

export default TestGenerator;
