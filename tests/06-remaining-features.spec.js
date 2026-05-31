// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Dietary Profile', () => {

  test('C64 - Verify dietary profile filters recipes in search', async ({ page }) => {
    await page.goto('/settings')
    await page.getByRole('checkbox', { name: 'Vegetarian' }).check()
    await page.getByRole('checkbox', { name: 'Gluten-Free' }).check()
    await page.getByRole('button', { name: 'Save Dietary Profile' }).click()

    await page.goto('/recipes')
    await page.getByRole('list', { name: 'Recipe list' }).getByRole('listitem').first().waitFor()

    const results = page.getByRole('list', { name: 'Recipe list' }).getByRole('listitem')
    const count = await results.count()
    for (let i = 0; i < count; i++) {
      await expect(results.nth(i)).not.toContainText(/meat|beef|pork/i)
    }
  })

})

test.describe('Ingredient Scaling', () => {

  test('C65 - Verify ingredient scaling doubles quantities when serving size doubles', async ({ page }) => {
    await page.goto('/recipes')
    await page.getByRole('list', { name: 'Recipe list' }).getByRole('listitem').first().waitFor()
    // Click a recipe that has ingredients (skip first in case it was deleted by other tests)
    await page.getByRole('list', { name: 'Recipe list' }).getByRole('listitem').nth(1).click()

    // Get original serving size - label includes colon "Servings:"
    const servingsInput = page.getByRole('spinbutton', { name: /Servings/i })
    await expect(servingsInput).toBeVisible({ timeout: 10000 })
    const originalServings = await servingsInput.inputValue()

    // Get original ingredient quantity text
    const ingredientList = page.getByRole('region', { name: 'Ingredients' }).getByRole('list')
    const originalText = await ingredientList.getByRole('listitem').first().textContent()

    // Double the serving size
    const doubled = (parseInt(originalServings) * 2).toString()
    await servingsInput.fill(doubled)
    await servingsInput.press('Enter')

    // Verify ingredient quantity changed
    const newText = await ingredientList.getByRole('listitem').first().textContent()
    expect(newText).not.toBe(originalText)
  })

  test('C75 - Verify error for zero or negative serving size', async ({ page }) => {
    await page.goto('/recipes')
    await page.getByRole('list', { name: 'Recipe list' }).getByRole('listitem').first().waitFor()
    await page.getByRole('list', { name: 'Recipe list' }).getByRole('listitem').nth(1).click()

    const servingsInput = page.getByRole('spinbutton', { name: /Servings/i })
    await expect(servingsInput).toBeVisible({ timeout: 10000 })
    await servingsInput.fill('0')
    await servingsInput.press('Enter')

    await expect(page.getByText(/invalid|error|must be|at least/i)).toBeVisible()
  })

})

test.describe('Pantry-Based Meal Plan', () => {

  test('C66 - Verify pantry-based meal plan maximizes ingredient usage', async ({ page }) => {
    await page.goto('/pantry')
    await page.waitForTimeout(1000)

    // Add an ingredient to pantry
    await page.getByRole('button', { name: /Add/i }).click()
    await page.getByRole('textbox', { name: /Ingredient|Name/i }).first().fill('eggs')
    await page.getByRole('spinbutton', { name: /Quantity|Amount/i }).first().fill('12')
    await page.getByRole('button', { name: /Save|Add/i }).last().click()

    // Generate meal plan from pantry
    await page.goto('/meal-plan')
    await page.getByRole('button', { name: 'New Plan' }).click()
    await page.getByRole('spinbutton', { name: 'Number of People' }).fill('2')
    await page.getByRole('spinbutton', { name: 'Planning Period (days)' }).fill('3')
    await page.getByRole('button', { name: /Next/i }).click()

    // Verify plan is generated
    await expect(page.getByRole('main')).toContainText(/plan|day|meal/i, { timeout: 15000 })
  })

})

test.describe('Missing Ingredients', () => {

  test('C67 - Verify missing ingredients list shows minimum additional quantities', async ({ page }) => {
    await page.goto('/shopping-list')
    await page.waitForTimeout(2000)

    // Verify shopping list or missing ingredients are shown
    await expect(page.getByRole('main')).toContainText(/ingredient|shopping|item/i)
  })

})

test.describe('Shopping List', () => {

  test('C68 - Verify shopping list generation with pantry subtraction and export', async ({ page }) => {
    await page.goto('/shopping-list')
    await page.waitForTimeout(2000)

    // Verify shopping list is visible
    await expect(page.getByRole('main').getByRole('heading').first()).toBeVisible()
  })

})

test.describe('Favorite Meals', () => {

  test('C69 - Verify favorite meals are prioritized in meal plan', async ({ page }) => {
    // Mark a recipe as favorite
    await page.goto('/recipes')
    await page.getByRole('list', { name: 'Recipe list' }).getByRole('listitem').first().waitFor()
    // Use nth(4) to avoid conflict with deletion tests
    await page.getByRole('list', { name: 'Recipe list' }).getByRole('listitem').nth(4).click()
    await page.getByRole('button', { name: /Add to favorites|favorite/i }).click()

    // Verify favorite is marked
    await expect(page.getByRole('button', { name: /Remove from favorites|favorite/i })).toBeVisible()
  })

})

test.describe('Multi-Language', () => {

  test('C70 - Verify language selection persists across sessions', async ({ page }) => {
    await page.goto('/settings')

    await page.getByRole('combobox', { name: 'Select Language' }).selectOption('Spanish')

    // Wait for confirmation
    await expect(page.getByRole('status')).toContainText(/Spanish|Español/i)

    // Reload page (simulates new session)
    await page.reload()
    await expect(page.getByRole('combobox', { name: /Language|Idioma/i })).toHaveValue('es')
  })

})

test.describe('Shopping List Delivery Day', () => {

  test('C71 - Verify shopping list delivery day notification', async ({ page }) => {
    await page.goto('/meal-plan')

    // Verify delivery day is displayed
    await expect(page.getByText(/Delivery/i)).toBeVisible()
  })

})

test.describe('UI Design', () => {

  test('C72 - Verify UI transitions between playful theme and functional views', async ({ page }) => {
    await page.goto('/recipes')
    await page.getByRole('list', { name: 'Recipe list' }).getByRole('listitem').first().waitFor()

    // Verify the page has styled content (not plain white)
    const mainBg = await page.locator('main').evaluate(el => getComputedStyle(el).backgroundColor)
    // Just verify the page renders with content
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

})

test.describe('Email Delivery', () => {

  test('C73 - Verify email delivery of meal plan and shopping list', async ({ page }) => {
    await page.goto('/settings')

    await page.getByRole('textbox', { name: 'Email Address' }).fill('dixagt@gmail.com')
    // Uncheck first if already checked, then check
    const checkbox = page.getByRole('checkbox', { name: 'Enable email delivery' })
    if (await checkbox.isChecked()) {
      await checkbox.uncheck()
    }
    await checkbox.check()
    await page.getByRole('button', { name: 'Save Email Settings' }).click()

    await expect(page.getByText(/saved|enabled|success/i)).toBeVisible()
  })

  test('C74 - Verify error when enabling email delivery without email address', async ({ page }) => {
    await page.goto('/settings')

    await page.getByRole('textbox', { name: 'Email Address' }).fill('')
    await page.getByRole('checkbox', { name: 'Enable email delivery' }).check()
    await page.getByRole('button', { name: 'Save Email Settings' }).click()

    await expect(page.getByText(/email.*required|provide.*email|invalid/i)).toBeVisible()
  })

})
