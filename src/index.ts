import fs from 'fs';
import 'isomorphic-fetch';
import path from 'path';

import { userOptions } from './constant';
import CreateCLI, { OptionTypeExtension } from './create';
import { HuskyGPTCreate, HuskyGPTReview, HuskyGPTTest } from './huskygpt';
import ReadFiles from './reader';
import { HuskyGPTTypeEnum, IUserOptions } from './types';
import { makeDirExist } from './utils';
import { readPromptFile } from './utils/read-prompt-file';

const runMap: Record<HuskyGPTTypeEnum, () => void> = {
  [HuskyGPTTypeEnum.Test]: async () => {
    const testFilePaths = new ReadFiles();
    const huskygpt = new HuskyGPTTest();

    // Generate a test case for each file path
    for (const fileResult of testFilePaths.getFileResults()) {
      await huskygpt.run(fileResult);
    }
  },
  [HuskyGPTTypeEnum.Review]: async () => {
    const reviewFiles = new ReadFiles();
    const huskygpt = new HuskyGPTReview();

    // Review code for each file path
    for (const fileResult of reviewFiles.getFileResults()) {
      await huskygpt.run(fileResult);
    }

    // Publish the notices to the webhook channel
    huskygpt.publishNotice();
  },
  [HuskyGPTTypeEnum.Create]: async () => {
    const huskygpt = new HuskyGPTCreate();
    const cli = new CreateCLI(
      async ({ option, dirName, name, description }) => {
        const message = await huskygpt.run({
          fileContent: `${readPromptFile(
            `create-${option}.txt`,
          )}\n Please reply "${option}" code by following requirements: ${description}`,
        });
        const dirPath = path.join(
          process.cwd(),
          userOptions.options.readFilesRootName,
          option,
          dirName,
        );
        makeDirExist(dirPath);
        fs.writeFileSync(
          path.join(dirPath, `${name}.${OptionTypeExtension[option]}`),
          message,
        );
      },
    );

    await cli.start();
  },
};

/**
 * Main function for huskygpt
 */
export function main(options?: IUserOptions) {
  userOptions.init(options);
  const type = userOptions.huskyGPTType;

  if (!runMap[type]) throw new Error('Invalid huskyGPTType: ' + type);

  // Print debug info
  if (userOptions.options.debug) {
    console.log(
      'Running huskygpt with options: ',
      JSON.stringify(userOptions.options),
    );
  }

  runMap[type]();
}

export default main;
