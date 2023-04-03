import { EXTENSION_ID, createBrowserContext } from './utils';
const { test, expect } = require('@playwright/test');

test('URL form accept user-given URLs', async () => {
  // prepare for test
  const browserContext = await createBrowserContext();
  const page = await browserContext.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/index.html`);
  await page.bringToFront();

  // find url input and type google.com
  const addURLInput = await page.locator('#form-add-URL');
  await addURLInput.type('https://www.google.com/');

  await expect(addURLInput).toHaveValue('https://www.google.com/');
});