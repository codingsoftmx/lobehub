import { pathToFileURL } from 'node:url';

export const filePathToAppUrl = (filePath: string) => {
  return `app://codingsoft.org${pathToFileURL(filePath).pathname}`;
};
