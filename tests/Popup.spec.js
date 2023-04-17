// unit/integration tests for Popup component

import { getPageFromContext } from "./utils";
const { test, expect } = require("@playwright/test");


test("popup exists", async() => {
  const page = await getPageFromContext();
  const popup = await page.locator("body");
  expect(popup).toBeVisible();

  const tabList = await popup.getByRole("tablist");
  expect(tabList).toBeVisible();
});


test("Popup exists and contains 3 tabs", async () => {
  const page = await getPageFromContext();
  const tabList = await page.getByRole("tablist");

  expect(tabList).toHaveCount(3);
});


test('Find and click "Block URLs" tab', async() => {
  const page = await getPageFromContext();
  const popup = await page.locator("body");
  const tabList = await popup.getByRole("tablist");

  // check that blocking tab exists
  const BlockingTab = await tabList.getByRole("button").filter({ hasText: 'Blocked URLs' });
  expect(BlockingTab).toBeVisible();

  // check popup contents BEFORE blocking tab is clicked
  // e.g. expecting 'Block URLs' tabpanel to be visible
  const blockingTabPanelID = '#popup-tabs-tabpane-block-urls';
  const tasklistsTabPanelID = '#popup-tabs-tabpane-tasklists';

  expect(popup.locator(blockingTabPanelID)).toBeVisible();
  expect(popup.locator(tasklistsTabPanelID)).not.toBeVisible();

  // click blocking tab
  BlockingTab.click();

  // check popup contents AFTER blocking tab is clicked
  expect(popup.locator(blockingTabPanelID)).not.toBeVisible();
  expect(popup.locator(tasklistsTabPanelID)).toBeVisible();

  // click blocking tab
  BlockingTab.click();

  // check popup contents AFTER blocking tab is clicked again
  expect(popup.locator(blockingTabPanelID)).toBeVisible();
  expect(popup.locator(tasklistsTabPanelID)).not.toBeVisible();
});


test('Find and click "Task Lists" tab', async() => {
  const page = await getPageFromContext();
  const popup = await page.locator("body");
  const tabList = await popup.getByRole("tablist");

  // check that tasklists tab exists
  const TaskListsTab = await tabList.getByRole("button").filter({ hasText: 'Task Lists' });
  expect(TaskListsTab).toBeVisible();

  // check popup contents BEFORE tasklists tab is clicked
  // e.g. expecting 'Block URLs' tabpanel to be visible
  const blockingTabPanelID = '#popup-tabs-tabpane-block-urls';
  const tasklistsTabPanelID = '#popup-tabs-tabpane-tasklists';

  expect(popup.locator(blockingTabPanelID)).toBeVisible();
  expect(popup.locator(tasklistsTabPanelID)).not.toBeVisible();

  // click tasklists tab
  TaskListsTab.click();

  // check popup contents AFTER tasklists tab is clicked
  expect(popup.locator(blockingTabPanelID)).not.toBeVisible();
  expect(popup.locator(tasklistsTabPanelID)).toBeVisible();

  // confirm that clicking tasklists button again doesn't do anything
  TaskListsTab.click();

  expect(popup.locator(blockingTabPanelID)).not.toBeVisible();
  expect(popup.locator(tasklistsTabPanelID)).toBeVisible();
});


test('Find and click "Insights" tab', async() => {
  const page = await getPageFromContext();
  const popup = await page.locator("body");
  const tabList = await popup.getByRole("tablist");

  // check that insights/dashboard tab exists
  const InsightsTab = await tabList.getByRole("button").filter({ hasText: 'Task Lists' });
  expect(InsightsTab).toBeVisible();

  // check popup contents BEFORE insights tab is clicked
  // e.g. expecting 'Block URLs' tabpanel to be visible
  const blockingTabPanelID = '#popup-tabs-tabpane-block-urls';
  const insightsTabPanelID = '#popup-tabs-tabpane-insights';

  expect(popup.locator(blockingTabPanelID)).toBeVisible();
  expect(popup.locator(insightsTabPanelID)).not.toBeVisible();

  // click insights tab
  InsightsTab.click();

  // check popup contents AFTER insights tab is clicked
  expect(popup.locator(blockingTabPanelID)).not.toBeVisible();
  expect(popup.locator(insightsTabPanelID)).toBeVisible();

  // confirm that clicking insights button again doesn't do anything
  InsightsTab.click();

  expect(popup.locator(blockingTabPanelID)).not.toBeVisible();
  expect(popup.locator(insightsTabPanelID)).toBeVisible();
});

