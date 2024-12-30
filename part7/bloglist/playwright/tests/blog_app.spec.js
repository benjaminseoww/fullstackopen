// @ts-check
import { test, expect } from '@playwright/test'
const { login, createBlog } = require('./helper')

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {

    // clear out the databases
    await request.post('http://localhost:5173/api/testing/reset')

    // create a new e2e user 
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'E2E User',
        username: 'e2euser',
        password: 'e2e12345pw'
      }
    })

    // creating a seperate user for testing
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'Other User',
        username: 'otheruser',
        password: 'otherpass'
      }
    })

    await page.goto('http://localhost:5173');
  })

  test('Login form is shown', async ({ page }) => {
    await page.waitForSelector('form')

    // ensure form is present
    const formElement = await page.locator('form')
    expect(formElement)

    // expect the header
    const header = await page.getByText('Log in to application')
    expect(header).toBeVisible()

    // finds input field that has name of username
    const usernameInput = await formElement.locator('input[name="username"]')
    expect(usernameInput).toBeVisible()

    // finds input field that has name of password
    const passwordInput = await formElement.locator('input[name="password"]')
    expect(passwordInput).toBeVisible()

    // finds submit button that has value of Login
    const submitButton = await formElement.locator('input[type="submit"]')
    expect(submitButton).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.waitForSelector('form')
      await login(page, 'e2euser', 'e2e12345pw')
      await expect(page.getByText('blogs')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.waitForSelector('form')
      await login(page, 'e2euser', 'wrongpassword')

      await page.waitForSelector('div[id="notification"]')
      const notification = await page.locator('div[id="notification"]')
      expect(notification).toHaveText('wrong username or password')
    })
  })

  test.describe('When main user logged in', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, 'e2euser', 'e2e12345pw')
      await page.waitForLoadState()
    })

    test('a new blog can be created', async ({ page }) => {
      // click the new blog button
      await page.getByText('new note').click()

      // fill in the form
      await createBlog(page, 'E2E test title', 'E2E test author', 'http://e2e.test')

      // look for notification
      await page.waitForSelector('div[id="notification"]')
      const notification = await page.locator('div[id="notification"]')
      expect(notification).toHaveText('a new blog E2E test title by E2E test author added')

      // check if the new blog is visible
      const blogCard = await page.getByText('E2E test title E2E test author')
      expect(blogCard).toBeVisible()
    })

    test.describe("when new blog is created", () => {
      test.beforeEach(async ({page}) => {
        // click the new blog button
        await page.getByText('new note').click()

        // fill in the form to create a new blog
        await createBlog(page, 'E2E test title', 'E2E test author', 'http://e2e.test') 
      })

      test("blog can be liked by user", async ({page}) => {
        const blogDefaultView = await page.getByText('E2E test title E2E test author')
        await blogDefaultView.getByText('view').click()
        const blogCard = blogDefaultView.locator('..')
        await blogCard.locator('div[class="blogToggledView"]').waitFor({state: 'visible'})
        await expect(blogCard.getByText('0')).toBeVisible()
        await blogCard.getByText('like').click()
        await expect(blogCard.getByText('1')).toBeVisible()
      })

      test("blog can be deleted by user", async ({page}) => {
        const blogDefaultView = await page.getByText('E2E test title E2E test author')
        await blogDefaultView.getByText('view').click()
        const blogCard = blogDefaultView.locator('..')
        await blogCard.locator('div[class="blogToggledView"]').waitFor({state: 'visible'})
        page.on('dialog', dialog => dialog.accept())
        await blogCard.getByText('remove').click()
        await page.waitForLoadState()
        await expect(blogCard).not.toBeVisible()
      })

      test("other user cannot delete", async ({page}) => {
        await page.getByText('logout').click()
        await page.waitForLoadState()
        await page.waitForSelector('form')
        login(page, 'otheruser', 'otherpass')
        await page.waitForLoadState()
        const blogDefaultView = await page.getByText('E2E test title E2E test author')
        await blogDefaultView.getByText('view').click()
        const blogCard = blogDefaultView.locator('..')
        await blogCard.locator('div[class="blogToggledView"]').waitFor({state: 'visible'})
        await expect(blogCard.getByText('remove')).not.toBeVisible()
      })

      test.only("blogs are ordered by likes", async ({page}) => {
        // creating another blog
        createBlog(page, 'other blog', 'other author', 'http://other.blog')

        // checking that there is 2 blogs
        const oriBlogCard = await page.locator('.blog').filter({hasText: /E2E test title/i})
        const newBlogCard = await page.locator('.blog').filter({hasText: /other blog/i})

        expect(oriBlogCard).toBeVisible()
        expect(newBlogCard).toBeVisible()

        // like the new blog a few times 
        await newBlogCard.getByText('view').click()
        await newBlogCard.locator('div[class="blogToggledView"]').waitFor({state: 'visible'})
        await newBlogCard.getByRole('button', { name: 'like' }).click() // like button not clicking

        // check if the new blog is the first one
        const blogCardList = await page.locator('div[class="blog"]')
        expect(blogCardList.nth(0)).toContainText(/other blog/i)
      })
    })
  })
})
