const login = async (page, username, password) => {
    const formElement = await page.locator('form')
    const usernameInput = await formElement.locator('input[name="username"]')
    await usernameInput.fill(username)

    const passwordInput = await formElement.locator('input[name="password"]')
    await passwordInput.fill(password)

    const submitButton = await formElement.locator('input[type="submit"]')
    await submitButton.click()
}

const createBlog = async (page, title, author, url) => {
    const createFormElement = await page.locator('form')
    await createFormElement.locator('input[name="title"]').fill(title)
    await createFormElement.locator('input[name="author"]').fill(author)
    await createFormElement.locator('input[name="url"]').fill(url)
    await createFormElement.locator('input[type="submit"]').click()
}

module.exports = {
    login,
    createBlog
}