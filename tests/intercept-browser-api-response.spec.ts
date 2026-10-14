import { test, expect } from '@playwright/test';

test('create article', async ({ page, request }) => {
await page.goto('https://conduit.bondaracademy.com/')
await page.getByText('Sign in').click()

await page.getByRole('textbox', { name: 'Email' }).fill('robertoemprende40@gmail.com')
await page.getByRole('textbox', { name: 'Password' }).fill('Holamty2026')
await page.getByRole('button', { name: 'Sign in' }).click()

await page.getByText('New Article').click()
await page.screenshot({ path: 'screenshots/fomlayoutsPage.png'})
const formLayoutsPageBuffer = await page.screenshot()
console.log(formLayoutsPageBuffer.toString('base64'))
await page.getByRole('textbox' , {name: 'Article Title' }).fill('Playwright is awesome')
await page.getByRole('textbox' , {name: 'What\'s this article about?' }).fill('We can use APIs in Playwright')
await page.getByRole('textbox',{name:'Write your article (in markdown)'}).fill('Automate any web application in Playwright')
await page.getByRole('button' ,{name: 'Publish Article'}).click()


const createArticleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
const articleResponseJson = await createArticleResponse.json()
const slugID = articleResponseJson.article.slug 


await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome')
await page.getByText('Home').first().click()
 // aqui copie y pegue la linea 30 y la pegue en la 29 pero cambie el expect por page.locator
await page.locator('.article-preview h1').first().screenshot({path: 'screenshots/Playwright.png'})
await expect(page.locator('.article-preview h1').first()).toContainText('Playwright is awesome')


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

const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`, {
    headers: {
      Authorization: `Token ${token}`,
    }
  })
  expect(deleteResponse.status()).toEqual(204)
 }) 