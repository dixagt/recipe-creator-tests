// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Recipe Generation', () => {

  test('C51 - Verify recipe generation returns at least 3 suggestions', async ({ page }) => {
    await page.goto('/recipes/generate')

    await page.getByLabel('Ingredients').fill('eggs, milk, flour, butter')
    await page.getByRole('button', { name: 'Generate' }).click()

    const suggestions = page.locator('[data-testid="recipe-suggestion"]')
    await expect(suggestions).toHaveCount(3, { timeout: 5000 })
  })

  test('C52 - Verify recipe generation filters by meal type', async ({ page }) => {
    await page.goto('/recipes/generate')

    await page.getByLabel('Ingredients').fill('eggs, bread, cheese')
    await page.getByLabel('Meal Type').selectOption('Breakfast')
    await page.getByRole('button', { name: 'Generate' }).click()

    const suggestions = page.locator('[data-testid="recipe-suggestion"]')
    await expect(suggestions.first()).toBeVisible()

    // Verify all suggestions are breakfast type
    const count = await suggestions.count()
    for (let i = 0; i < count; i++) {
      await expect(suggestions.nth(i).locator('[data-testid="meal-type"]')).toHaveText('Breakfast')
    }
  })

  test('C53 - Verify recipe generation respects dietary restrictions', async ({ page }) => {
    // Set dietary profile first
    await page.goto('/settings/dietary-profile')
    await page.getByLabel('Gluten-free').check()
    await page.getByRole('button', { name: 'Save' }).click()

    // Generate recipes
    await page.goto('/recipes/generate')
    await page.getByLabel('Ingredients').fill('rice, chicken, vegetables')
    await page.getByRole('button', { name: 'Generate' }).click()

    const suggestions = page.locator('[data-testid="recipe-suggestion"]')
    await expect(suggestions.first()).toBeVisible()

    // Verify no gluten-containing recipes
    const count = await suggestions.count()
    for (let i = 0; i < count; i++) {
      await expect(suggestions.nth(i)).not.toContainText(/wheat|bread|pasta|flour/i)
    }
  })

  test('C54 - Verify message when no recipe suggestions are found', async ({ page }) => {
    await page.goto('/recipes/generate')

    await page.getByLabel('Ingredients').fill('dragon fruit')
    await page.getByRole('button', { name: 'Generate' }).click()

    await expect(page.getByText(/no.*suggestions|add more ingredients/i)).toBeVisible()
  })

  test('C55 - Verify recipe generation returns results within 3 seconds', async ({ page }) => {
    await page.goto('/recipes/generate')

    await page.getByLabel('Ingredients').fill('eggs, milk, flour, butter, sugar')
    
    const startTime = Date.now()
    await page.getByRole('button', { name: 'Generate' }).click()
    await page.locator('[data-testid="recipe-suggestion"]').first().waitFor()
    const elapsed = Date.now() - startTime

    expect(elapsed).toBeLessThan(3000)
  })

})
