// define variables and functions to be used across multiple tests

import { chromium } from "@playwright/test";
import path from "path";

export const EXTENSION_ID = "alkbbhmbhgomddkieknclnjmhlgdgeig";
export const EXTENSION_URL = `chrome-extension://${EXTENSION_ID}/index.html`;

const pathToExtension = path.join(__dirname, '../build');
const userDataDir = '';

export const createBrowserContext = async () => {
  return await chromium.launchPersistentContext(
    userDataDir,
    {
      devtools: true,
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`
      ],
    }
  );
}
