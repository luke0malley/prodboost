// unit/integration tests for SessionDuration component

import { getPageFromContext } from "./utils";
const { test, expect } = require("@playwright/test");


const SECTION_ID = "#section-session-duration";


test("Session Duration section exists", async () => {
  const page = await getPageFromContext();

  const sessionDurationSection = await page.locator(SECTION_ID);
  expect(sessionDurationSection).toBeVisible();
});