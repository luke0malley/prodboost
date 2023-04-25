// unit/integration tests for TaskLists component

import { getPageFromContext } from "./utils";
const { test, expect } = require("@playwright/test");


// timeout
test.skip("Default layout: 'Create New List' button exists", async () => {
  // switch to Task Lists tab/view
  const page = await getPageFromContext();
  await page.getByRole("button").filter({ hasText: 'Task Lists' }).click();
  const tasklistsSection = page.locator('#popup-tabs-tabpane-tasklists');

  // check for all elements present with 0 task lists
  const createNewListButton = await tasklistsSection.getByLabel("Create New List");
  expect(createNewListButton).toBeVisible();
});


// timeout
test.skip("Default layout: 'Add New List' field and button exist", async () => {
  // switch to Task Lists tab/view
  const page = await getPageFromContext();
  await page.getByRole("button").filter({ hasText: 'Task Lists' }).click();
  const tasklistsSection = page.locator('#popup-tabs-tabpane-tasklists');

  // check for all elements present with 0 task lists
  const addNewListInput = await tasklistsSection.getByLabel("Add New List");
  expect(addNewListInput).toBeVisible();
  expect(addNewListInput).toBeEmpty();

  const addListButton = await tasklistsSection.getByRole("button").filter({ hasText: "Add List" });
  expect(addListButton).toBeVisible();
});

