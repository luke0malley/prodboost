// unit/integration tests for BlockedURLs component

import { getPageFromContext } from "./utils";
const { test, expect } = require("@playwright/test");


const SECTION_ID = "#section-blocked-urls";


test("Blocked URLs section exists", async () => {
  const page = await getPageFromContext();

  // find section
  const addURLSection = await page.locator(SECTION_ID);
  expect(addURLSection).toBeVisible();

  // find 'Blocked URLs' text
  // expect(addURLSection.filter({hasText: 'Blocked URLs'})).toBeVisible();
  expect(addURLSection).toContainText('Blocked URLs');

  // find URL list, which is a <table> element
  const urlList = await addURLSection.locator("table");
  expect(urlList).toBeVisible();

  // find add URL form
  // grab input via its associated label text
  const addURLsInput = addURLSection.getByLabel("Add URL to Block");
  expect(addURLsInput).toBeVisible();

  // find add URL button
  const addURLButton = addURLSection.getByRole("button").filter({hasText: "Add URL"});
  expect(addURLButton).toBeVisible();
});


test("Blocked URLs section initial set up", async () => {
  const page = await getPageFromContext();
  const addURLSection = await page.locator(SECTION_ID);

  // URL list set up and contents (3 cols, 0 URLs)
  const urlTable = await addURLSection.locator("table");
  expect(urlTable.locator("thead").locator("tr")).toHaveCount(2); // empty cells don't count?

  const urlList = urlTable.locator("tbody")
  expect(urlList).toHaveCount(1);

  const urlRow = urlList.first()
  expect(urlRow).toHaveCount(3);
  expect(urlRow.nth(0)).toHaveText("Nothing here yet...");
  expect(urlRow.first().nth(1)).toHaveText("...");
  expect(urlRow.first().nth(2)).toHaveText("...");

  // "Add URL" button disabled
  const addURLButton = await addURLSection.getByRole("button").filter({ hasText: "Add URL" });
  expect(addURLButton).toBeDisabled();

  // "Edit URLs" button hidden
  const editURLsButton = await addURLSection.getByRole("button").filter({ hasText: "Edit URLs" });
  expect(editURLsButton).not.toBeVisible();

  // URL input has default value
  const urlInput = await addURLSection.getByLabel("Add URL to Block");
  expect(urlInput).toHaveValue("");
});


test("add 1 URL to URL list", async () => {
  const page = await getPageFromContext();
  const addURLSection = await page.locator(SECTION_ID);
  const exampleURL1 = "https://www.google.com/";
  const exampleURL2 = "https://www.example.com/";

  const urlTable = await addURLSection.locator("table");
  const addURLInput = await addURLSection.getByLabel("Add URL to Block");
  const addURLButton = await addURLSection.getByRole("button").filter({ hasText: "Add URL" });

  // enter URL1 into input
  await addURLInput.fill(exampleURL1);
  await expect(addURLInput).toHaveValue(exampleURL1);

  // click 'Add URL' button
  addURLButton.click();

  // confirm clearing of input box
  await expect(addURLInput).toHaveValue("");

  // confirm entry of URL1 into table
  expect(urlTable.locator("thead").locator("tr")).toHaveCount(2); // empty cells don't count?

  const urlList = urlTable.locator("tbody")
  expect(urlList).toHaveCount(1);
  expect(urlList.last()).toHaveCount(3);
  expect(urlList.last().nth(0)).toHaveText(exampleURL1);
  expect(urlList.last().nth(1)).not.toBeEmpty();
  expect(urlList.last().nth(2)).toBeEmpty();

  // add URL2
  await addURLInput.fill(exampleURL2);
  await expect(addURLInput).toHaveValue(exampleURL2);
  addURLButton.click();

  // confirm clearing of input box
  await expect(addURLInput).toHaveValue("");

  // confirm entry of URL1 into table
  expect(urlTable.locator("thead").locator("tr")).toHaveCount(2); // empty cells don't count?

  expect(urlList).toHaveCount(2);
  expect(urlList.last()).toHaveCount(3);
  expect(urlList.last().nth(0)).toHaveText(exampleURL2);
  expect(urlList.last().nth(1)).not.toBeEmpty();
  expect(urlList.last().nth(2)).toBeEmpty();
});


test("Blocked URLs: edit button visible with non-empty URL list", async () => {
  const page = await getPageFromContext();
  const addURLSection = await page.locator(SECTION_ID);
  const exampleURL1 = "https://www.google.com/";
  const exampleURL2 = "https://www.example.com/";

  // locate all important elements
  const urlList = await addURLSection.locator("tbody");
  const urlInput = await addURLSection.getByLabel("Add URL to Block");
  const addURLButton = await addURLSection.getByRole("button").filter({ hasText: "Add URL" });
  const editURLsButton = await addURLSection.getByRole("button").filter({ hasText: "Edit URLs" });

  // confirm lack of 'Edit URLs' button at startup
  expect(editURLsButton).not.toBeVisible();

  // add URL1 to list and confirm visibility of 'Edit URLs' button
  await urlInput.fill(exampleURL1);
  await addURLButton.click();
  expect(editURLsButton).toBeVisible();

  // add URL2 to list and confirm visibility of 'Edit URLs' button
  await urlInput.fill(exampleURL2);
  await addURLButton.click();
  expect(editURLsButton).toBeVisible();

  // remove URL1 from list (last item in list)
  await editURLsButton.click();
  const url1Entry = await urlList.last();
  url1Entry.getByRole("button").click();

  // confirm visibility of 'Edit URLs' button
  expect(editURLsButton).toBeVisible();

  // (still in edit mode)
  const url2Entry = await urlList.last();
  expect(url2Entry.first()).toHaveText(exampleURL2);
  url2Entry.getByRole("button").click();

  // confirm (in)visibility of 'Edit URLs' button
  expect(editURLsButton).not.toBeVisible();
});


test("Blocked URLs: delete button(s) visible only in 'edit mode'", async () => {
  const page = await getPageFromContext();
  const addURLSection = await page.locator(SECTION_ID);
  const exampleURL1 = "https://www.google.com/";
  const exampleURL2 = "https://www.google.com/";

  // locate all important elements
  const urlList = await addURLSection.locator("tbody");
  const urlInput = await addURLSection.getByLabel("Add URL to Block");
  const addURLButton = await addURLSection.getByRole("button").filter({ hasText: "Add URL" });
  const editURLsButton = await addURLSection.getByRole("button").filter({ hasText: "Edit URLs" });

  // confirm lack of delete button at startup
  expect(editURLsButton).not.toBeVisible();

  // add URL1 and URL2 to list
  await urlInput.fill(exampleURL1);
  await addURLButton.click();
  const url1Entry = await urlList.last();

  await urlInput.fill(exampleURL2);
  await addURLButton.click();
  const url2Entry = await urlList.last();

  // confirm delete buttons not visible at startup
  expect(url1Entry.last()).toBeEmpty();
  expect(url2Entry.last()).toBeEmpty();

  // toggle on 'edit mode' and confirm visibility of delete buttons
  editURLsButton.click();
  expect(url1Entry.last()).not.toBeEmpty();
  expect(url2Entry.last()).not.toBeEmpty();

  // toggle off 'edit mode' and confirm invisibility again
  editURLsButton.click();
  expect(url1Entry.last()).toBeEmpty();
  expect(url2Entry.last()).toBeEmpty();
});


// apparently time out error?
test.skip("Blocked URLs: URL list delete 1 URL per 'edit mode'", async () => {
  const page = await getPageFromContext();
  const addURLSection = await page.locator(SECTION_ID);
  const exampleURL1 = "https://www.google.com/";
  const exampleURL2 = "https://www.example.com/";

  // locate all important elements
  const urlList = await addURLSection.locator("tbody");
  const urlInput = await addURLSection.getByLabel("Add URL to Block");
  const addURLButton = await addURLSection.getByRole("button").filter({ hasText: "Add URL" });
  const editURLsButton = await addURLSection.getByRole("button").filter({ hasText: "Edit URLs" });

  // add urls to list
  await urlInput.fill(exampleURL1);
  await addURLButton.click();
  await urlInput.fill(exampleURL2);
  await addURLButton.click();
  expect(urlList).toHaveCount(2);

  // toggle on "edit mode" and remove URL1
  await editURLsButton.click();

  const url1Entry = await urlList.first();
  url1Entry.getByRole("button").click(); // TODO

  expect(urlList).toHaveCount(1);
  expect(urlList.nth(0).first()).toHaveText(exampleURL2);

  // toggle "edit mode" off and on, remove URL
  await editURLsButton.click();
  await editURLsButton.click();
  const url2Entry = await urlList.last();
  url2Entry.getByRole("button").click();

  expect(urlList).toHaveCount(1);
  expect(urlList.nth(0).first()).toHaveText("Nothing here yet...");
});


test.describe("Blocked URLs: URL list's displaying of URLs", async () => {
  test('Blocked URLs: URL list handling regular/short URLs', async () => {
    const page = await getPageFromContext();
    const addURLSection = await page.locator(SECTION_ID);
    const exampleURL = "www.google.com";

    // locate important elements
    const urlList = addURLSection.locator("tbody");
    const urlInput = addURLSection.getByLabel("Add URL to Block");
    const addURLButton = addURLSection.getByRole("button").filter({ hasText: "add URL" });

    // add short/normal-length URL to list
    await urlInput.fill(exampleURL);
    await addURLButton.click();

    // confirm URL's presence in list
    expect(urlList).toHaveCount(1);

    const urlEntry = urlList.first();
    expect(urlEntry.first()).toHaveText(exampleURL);
    const urlText = urlEntry.textContent();

    // find URL's row and confirm difference in background color of a list row upon hover

    // click URL's row and confirm its text did not change
    await urlEntry.click();
    expect(urlEntry.textContent()).toEqual(urlText);

    // click URL's row again and confirm its text did not change
    await urlEntry.click();
    expect(urlEntry.textContent()).toEqual(urlText);
  });

  test('Blocked URLs: URL list handling long URLs', async () => {
    const page = await getPageFromContext();
    const addURLSection = await page.locator(SECTION_ID);
    const exampleURL = "https://www.google.com/search?q=This+is+a+query&ei=j50sZInpMfigptQPoPCRgAE&ved=0ahUKEwjJ7M65nJH-AhV4kIkEHSB4BBAQ4dUDCBA&uact=5&oq=This+is+a+query&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIICAAQFhAeEA8yCAgAEBYQHhAPMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMggIABCKBRCGAzoKCAAQRxDWBBCwAzoRCC4QigUQxwEQ0QMQkQIQ6gQ6CAgAEIoFEJECOgsILhCKBRCxAxCDAToLCAAQigUQsQMQgwE6EQguEIAEELEDEIMBEMcBENEDOgsIABCABBCxAxCDAToOCC4QgAQQsQMQxwEQ0QM6CAguEIAEENQCOgsILhDUAhCxAxCABDoICC4QgAQQsQM6DgguEIoFELEDEIMBENQCOhQILhCABBCxAxCDARDHARDRAxDUAjoFCAAQgAQ6CAgAEIAEEMkDOggIABCKBRCSAzoOCAAQigUQsQMQgwEQkQI6BQguEIAEOg4IABCABBCxAxCDARDJAzoLCC4QgAQQ1AIQ6gQ6CwguEIAEELEDEIMBOg4ILhCDARCxAxCABBDqBDoICAAQgAQQsQM6CAguEIAEEOoEOggILhCABBDlBEoECEEYAFDLAliQEGCIEWgBcAF4AIABkwGIAcIKkgEEMTMuMpgBAKABAcgBCMABAQ&sclient=gws-wiz-serp";

    // locate important elements
    const urlList = addURLSection.locator("tbody");
    const urlInput = addURLSection.getByLabel("Add URL to Block");
    const addURLButton = addURLSection.getByRole("button").filter({ hasText: "add URL" });

    // add long URL to list
    await urlInput.fill(exampleURL);
    await addURLButton.click();

    // confirm URL's presence in list
    expect(urlList).toHaveCount(1);

    const urlRow = urlList.first(); // first row
    expect(urlRow.first()).toHaveText(exampleURL);

    // find URL's row and confirm difference in background color of a list row upon hover

    // get displayed text of URL within list and confirm that it does not match full URL
    expect(urlRow.first()).toHaveText(exampleURL);

    // click URL's row and confirm its text expanded to full URL
    const shortenedURLText = await urlRow.first().textContent();
    await urlRow.click();
    expect(urlRow.first()).toHaveText(exampleURL);
    expect(urlRow.first()).not.toHaveText(shortenedURLText);

    // click URL's row again and confirm its text does not match full URL again
    await urlRow.click();
    expect(urlRow.first()).toHaveText(shortenedURLText);
    expect(urlRow.first()).not.toHaveText(exampleURL);
  });
});


// test("Blocked URLs: URL list displays amount of time since URL's entry", async () => {

// });


// test("Blocked URLs: section collapsible", async () => {
//   const page = await getPageFromContext();
//   const addURLSection = await page.locator(SECTION_ID);

//   // (section's expanded state at start up is confirmed by other tests)

//   // find and click section's "header" to trigger collapse

//   // confirm collapse via disappearance of section's contents

//   // click section header again to trigger expansion

//   // confirm section is expanded

// });


// test("Blocked URLs: cannot submit empty URL field", async () => {
//   const page = await getPageFromContext();
//   const addURLSection = await page.locator(SECTION_ID);

//   // find URL input field and confirm empty state

//   // find 'Add URL' button and attempt to click

//   // confirm inability to click

//   // input valid URL and confirm valid URL registered (but not submitted)

//   // confirm ability to click (but do not click)

//   // clear input field again

//   // confirm inability to click again

// });


// test("Blocked URLs: can submit valid URLs", async () => {
//   const page = await getPageFromContext();
//   const addURLSection = await page.locator(SECTION_ID);

//   // find URL input field and 'Add URL' button

//   const validURLs = [
//     "https://www.google.com/index.html",
//     "https://www.google.com/",
//     "https://bugs.chromium.org/p/chromium/issues/detail?id=706008#c36",
//     "www.google.com",
//     "google.com",
//   ];

//   validURLs.forEach(url => {
//     // enter URL into input field

//     // confirm lack of error message?

//     // click button (confirm successful click?)

//     // confirm acceptance by finding URL in list and confirming #entries has increased
//   });
// });


// test("Blocked URLs: cannot submit invalid URLs", async () => {
//   const page = await getPageFromContext();
//   const addURLSection = await page.locator(SECTION_ID);

//     // find URL input field and 'Add URL' button

//     const invalidURLs = [
//       ".",
//       "/",
//       "!",
//       "~",
//       "#",
//     ];

//     invalidURLs.forEach(url => {
//       // enter URL into input field

//       // confirm presence of error message?

//       // confirm inability to click button

//       // confirm emptyness of URL list

//     });
// });

