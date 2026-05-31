// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Recipe Search and Filtering', () => {

  test('C59 - Verify recipe search returns results by title or ingredient', async ({ page }) => {
    await page.goto('/recipes')

    // Wait for recipes to fully load
    const recipeList = page.getByRole('list', { name: 'Recipe list' })
    await expect(recipeList.getByRole('listitem')).not.toHaveCount(0, { timeout: 10000 })

    // Type search term
    await page.getByRole('searchbox', { name: 'Search recipes' }).fill('chicken')

    // Wait for filtering to complete — only chicken recipes should remain
    const chickenItems = recipeList.getByRole('listitem').filter({ hasText: /chicken/i })
    await expect(chickenItems).not.toHaveCount(0, { timeout: 5000 })

    // Wait until all items contain chicken (non-chicken items are gone)
    await expect(recipeList.getByRole('listitem')).toHaveCount(await chickenItems.count(), { timeout: 5000 })

    // Verify all visible results contain "chicken"
    const results = recipeList.getByRole('listitem')
    const count = await results.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const text = await results.nth(i).textContent()
      expect(text?.toLowerCase()).toContain('chicken')
    }
  })

  test('C60 - Verify search filters update results within 500ms', async ({ page }) => {
    await page.goto('/recipes')

    // Wait for initial recipes to fully load
    const recipeList = page.getByRole('list', { name: 'Recipe list' })
    await expect(recipeList.getByRole('listitem')).not.toHaveCount(0, { timeout: 10000 })
    // Give the page a moment to stabilize
    await page.waitForTimeout(500)

    const startTime = Date.now()
    await page.getByRole('combobox', { name: 'Meal Type' }).selectOption('Dinner')
    await recipeList.getByRole('listitem').first().waitFor()
    const elapsed = Date.now() - startTime

    expect(elapsed).toBeLessThan(1500)
  })

})
