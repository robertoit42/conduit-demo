import {test,expect} from '@playwright/test';
import tags from '../test-data/tags.json';


test('delete article', async ({ page, request }) => {
 // const loginResponse = await request.post('https://conduit.bondaracademy.com/api/users/login', {
    const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {   
 data: {
      user: {
        email: "robertoemprende40@gmail.com",
        password: 'Holamty2026',
       },
     },
 })
 expect(loginResponse.status()).toEqual(200)

const responseLoginJson = await loginResponse.json();
const token = responseLoginJson.user.token;

const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
  data: {
    article: {
      title: 'test title',
      description: 'test description',
      body: 'test body',
      tagList: {}
    },
  },
  headers: {
    Authorization: `Token ${token}`,
  }
})
expect(newArticleResponse.status()).toEqual(201)
await page.goto('https://conduit.bondaracademy.com/')
await page.getByText('Sign in').click()
await page.getByRole('textbox', { name: 'Email' }).fill('robertoemprende40@gmail.com')
await page.getByRole('textbox', { name: 'Password' }).fill('Holamty2026')
await page.getByRole('button', { name: 'Sign in' }).click()

await expect(page.locator('.preview-link h1').first()).toContainText('test title')
await page.getByText('test title').click()

const articlesResponse = page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
await page.getByRole('button', { name: 'Delete Article' }).first().click();
await articlesResponse;

await expect(page.locator('.preview-link h1').first()).not.toContainText('test title');
})
