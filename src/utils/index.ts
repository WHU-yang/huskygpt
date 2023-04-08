import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Get the file name from the file path
 * @param {string} filePath The file path
 */
export const getFileNameByPath = (filePath: string) =>
  filePath && path.basename(filePath, path.extname(filePath));

/**
 * Get the user email from the git config
 * @returns {string} The user email
 */
export const getUserEmail = () => {
  const output = execSync('git log -1 --pretty=format:%ae').toString().trim();
  return output;
};

/**
 * Delete the file by the file path
 */
export const deleteFile = (filePath: string) => {
  if (!fs.existsSync(filePath)) return;
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
};

// Create the directory if it doesn't exist
export const makeDirExist = (dirPath: string) => {
  if (fs.existsSync(dirPath)) return;
  fs.mkdirSync(dirPath, { recursive: true });
};

export * from './simply-result';
