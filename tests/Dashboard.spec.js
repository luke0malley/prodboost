// unit/integration tests for Dashboard component

import { getPageFromContext } from "./utils";
const { test, expect } = require("@playwright/test");


const SUMMARY_SECTION_ID = "#dashboard-summary";


test("Insights summary initialization", async () => {
  const page = await getPageFromContext();
  const dashboardSection = page.locator(SUMMARY_SECTION_ID);

  expect(dashboardSection).toBeVisible();
  expect(dashboardSection).toHaveCount(3);

  const sessionData = await dashboardSection.nth(1);
  expect(sessionData.first()).toContainText("Session Length");
  expect(sessionData.last()).toHaveText("0");

  const idleData = await dashboardSection.nth(2);
  expect(idleData.first()).toContainText("Idle Time");
  expect(idleData.last()).toHaveText("0");

  const blockedData = await dashboardSection.nth(3);
  expect(blockedData.first()).toContainText("Blocked Sites Visited");
  expect(blockedData.last()).toHaveText("0");
});


test("Insights chart initialization", async () => {
  const page = await getPageFromContext();
  const chart = page.getByLabel("Top Sites Used During Session");

  expect(chart).toBeVisible();
});
