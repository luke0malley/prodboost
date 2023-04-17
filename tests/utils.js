// define variables and functions to be used across multiple tests

import { chromium } from "@playwright/test";
import path from "path";

const EXTENSION_ID = "ijgekmejilmpbgmndioednbbojogdhpn";
const EXTENSION_URL = `chrome-extension://${EXTENSION_ID}/index.html`;

const pathToExtension = path.join(__dirname, '../build');
const userDataDir = '';

const createBrowserContext = async (headless) => {
  // create special browser context where our extension IS allowed
  // (extensions disallowed by default)

  const args = [
    `--disable-extensions-except=${pathToExtension}`,
    `--load-extension=${pathToExtension}`
  ];
  if (headless) {
    args.push('--headless=new');
  }

  return await chromium.launchPersistentContext(
    userDataDir,
    {
      headless: headless,
      args: args
    }
  );
}

export const getPageFromContext = async (headless=true) => {
  // "headless": if true, run test within headless/GUI-less browser context

  // create browser context and render page for extension
  const browserContext = await createBrowserContext(headless);
  const page = await browserContext.newPage();
  await page.goto(EXTENSION_URL);
  await page.bringToFront();
  return page;
}