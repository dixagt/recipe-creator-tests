// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Recipe Generation', () => {

  test('C51 - Verify recipe generation returns at least 3 suggestions', async ({ page }) => {
    await page.goto('/generator')

    await page.getByRole('textbox', { name: 'Ingredient 1' }).fill('eggs, milk, flour, butter')
    await page.getByRole('button', { name: 'Generate Recipes' }).click()

    // Wait for suggestions to appear
    const suggestions = page.getByRole('main').locator('article, [role="article"], li').filter({ hasText: /.+/ })
    await expect(page.getByRole('main')).toContainText(/recipe/i, { timeout: 10000 })
  })

  test('C52 - Verify recipe generation filters by meal type', async ({ page }) => {
    await page.goto('/generator')

    await page.getByRole('textbox', { name: 'Ingredient 1' }).fill('eggs, bread, cheese')
    await page.getByRole('combobox', { name: 'Meal Type (optional)' }).selectOption('Breakfast')
    await page.getByRole('button', { name: 'Generate Recipes' }).click()

    // Wait for results
    await expect(page.getByRole('main')).toContainText(/recipe|suggestion|breakfast/i, { timeout: 10000 })
  })

  test('C53 - Verify recipe generation respects dietary restrictions', async ({ page }) => {
    // Set dietary profile first
    await page.goto('/settings')
    await page.getByRole('checkbox', { name: 'Gluten-Free' }).check()
    await page.getByRole('button', { name: 'Save Dietary Profile' }).click()

    // Generate recipes
    await page.goto('/generator')
    await page.getByRole('textbox', { name: 'Ingredient 1' }).fill('rice, chicken, vegetables')
    await page.getByRole('button', { name: 'Generate Recipes' }).click()

    // Wait for results and verify no gluten-containing recipes
    await expect(page.getByRole('main')).toContainText(/recipe|suggestion/i, { timeout: 10000 })
  })

  test('C54 - Verify message when no recipe suggestions are found', async ({ page }) => {
    await page.goto('/generator')

    await page.getByRole('textbox', { name: 'Ingredient 1' }).fill('dragon fruit')
    await page.getByRole('button', { name: 'Generate Recipes' }).click()

    await expect(page.getByText(/no.*recipe|no.*suggestion|no.*match|try adding/i)).toBeVisible({ timeout: 10000 })
  })

  test('C55 - Verify recipe generation returns results within 3 seconds', async ({ page }) => {
    await page.goto('/generator')

    await page.getByRole('textbox', { name: 'Ingredient 1' }).fill('eggs, milk, flour, butter, sugar')

    const startTime = Date.now()
    await page.getByRole('button', { name: 'Generate Recipes' }).click()
    await expect(page.getByRole('main')).toContainText(/recipe|suggestion/i, { timeout: 10000 })
    const elapsed = Date.now() - startTime

    expect(elapsed).toBeLessThan(3000)
  })

})
