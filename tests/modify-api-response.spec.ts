import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json';

test.beforeEach(async ({ page }) => {
    await page.route('*/**/api/tags', async route => {
      await route.fulfill({
      json: tags,
     })
  })
    await page.route('*/**/api/articles**', async route => {
    })

  await page.route('**/api/articles**' , async route => {
    const response =  await route.fetch();
    const responseJson = await response.json();
    responseJson.articles[0].title = 'this is a mock title for article';
    responseJson.articles[0].description = 'This is a Mock description for article';
    await route.fulfill({
        json: responseJson,
        })
  })
      // Cargar la página después de registrar los intercepts
  await page.goto('https://conduit.bondaracademy.com/');
  });

  test('has title',async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page.locator('.navbar-brand')).toHaveText(/conduit/);
  await expect(page.locator('.sidebar .tag-pill')).toContainText(['Automation', 'Playwright']);
  await expect(page.locator ('.preview-link h1').first()).toContainText('this is a mock title for article should fail');
  await expect(page.locator ('.preview-link p').first()).toContainText('This is a Mock description for article');
  });