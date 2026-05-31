// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Recipe Editing and Deletion', () => {

  test('C61 - Verify recipe editing pre-populates form and saves changes', async ({ page }) => {
    await page.goto('/recipes')
    await page.locator('[data-testid="recipe-card"]').first().click()
    await page.getByRole('button', { name: 'Edit' }).click()

    // Verify form is pre-populated
    await expect(page.getByLabel('Title')).not.toHaveValue('')

    // Make a change
    await page.getByLabel('Title').fill('Updated Recipe Title')
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText(/updated|saved/i)).toBeVisible()
  })

  test('C62 - Verify recipe deletion with confirmation', async ({ page }) => {
    await page.goto('/recipes')
    const firstRecipe = page.locator('[data-testid="recipe-card"]').first()
    const recipeName = await firstRecipe.textContent()

    await firstRecipe.click()
    await page.getByRole('button', { name: 'Delete' }).click()

    // Confirmation prompt
    await expect(page.getByText(/are you sure|confirm/i)).toBeVisible()
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Recipe should be gone
    await expect(page.getByText(/deleted|removed/i)).toBeVisible()
  })

  test('C63 - Verify recipe deletion cancellation leaves recipe unchanged', async ({ page }) => {
    await page.goto('/recipes')
    const recipeCount = await page.locator('[data-testid="recipe-card"]').count()

    await page.locator('[data-testid="recipe-card"]').first().click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByRole('button', { name: 'Cancel' }).click()

    // Recipe should still be there
    await page.goto('/recipes')
    await expect(page.locator('[data-testid="recipe-card"]')).toHaveCount(recipeCount)
  })

})
