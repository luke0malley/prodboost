// unit/integration tests for NotificationSettings component

import { getPageFromContext } from "./utils";
const { test, expect } = require("@playwright/test");


const SECTION_ID = "#section-notification-settings";


test("Notification Settings section exists", async () => {
  const page = await getPageFromContext();
  const notificationSection = page.locator(SECTION_ID);

  expect(notificationSection).toBeVisible();
  expect(notificationSection).toHaveText("Notification Settings");
});


test("Notification Settings contains 'idle' notification option", async () => {
  const page = await getPageFromContext();
  const notificationSection = page.locator(SECTION_ID);

  const idleCheckbox = notificationSection.getByLabel("I have been idle for too long");

  expect(notificationSection).toBeVisible();
  expect(idleCheckbox).toBeChecked();
});