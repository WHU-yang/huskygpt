/**
 * The run mode of the huskygpt
 * test - Run the test file generation
 * review - Run the review file generation
 */
export enum HuskyGPTTypeEnum {
  Test = 'test',
  Review = 'review',
}

/**
 * The file extensions to search for
 * @enum {string}
 * @property {string} Directory - Read test files from directory
 * @property {string} GitStage - Read test files from git stage
 * @readonly
 * @type {ReadTypeEnum}
 * @default 'dir'
 */
export enum ReadTypeEnum {
  Directory = 'dir',
  GitStage = 'git',
}

export interface IReadFileResult {
  filePath?: string;
  fileContent?: string;
}

export interface IUserOptions {
  /**
   * OpenAI options
   */
  // OpenAI API key
  openAIKey?: string;
  // OpenAI model to use, default is 'text-davinci-003'
  openAIModel?: string;
  // OpenAI prompt to use, default is ''
  openAIPrompt?: string;
  // OpenAI max tokens to use, default is 2048
  openAIMaxTokens?: number;

  /**
   * Huskygpt options
   */
  // The type of huskygpt to run
  huskyGPTType?: HuskyGPTTypeEnum;

  /**
   * Read files options
   */
  // Read files from directory or git stage, default is 'git'
  readType?: ReadTypeEnum;
  // Read files from git stage, default is 'R, M, A', R = modified, M = modified, A = added
  readGitStatus?: string;
  // The root name of the directory to read files from, default is 'src'
  readFilesRootName?: string;
  // The file extensions to read, default is '.ts,.tsx'
  readFileExtensions?: string;

  /**
   * Huskygpt test options
   */
  // Generate test file type, default is 'test'
  testFileType?: string;
  // Generate test file name extension, default is '.ts'
  testFileNameExtension?: string;
  // Generate test file directory name, default is '__test__'
  testFileDirName?: string;

  /**
   * Huskygpt review options
   */
  reviewReportWebhook?: string;
  // Typing review in the console, 'true' or 'false', default is 'true'
  reviewTyping?: string;
}