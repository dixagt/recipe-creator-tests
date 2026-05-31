// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Recipe Creation', () => {

  test('C46 - Verify recipe creation form displays all required fields', async ({ page }) => {
    await page.goto('/recipes/new')

    await expect(page.getByLabel('Title')).toBeVisible()
    await expect(page.getByLabel('Ingredients')).toBeVisible()
    await expect(page.getByLabel('Instructions')).toBeVisible()
    await expect(page.getByLabel('Serving Size')).toBeVisible()
    await expect(page.getByLabel('Prep Time')).toBeVisible()
    await expect(page.getByLabel('Cook Time')).toBeVisible()
    await expect(page.getByLabel('Difficulty')).toBeVisible()
  })

  test('C47 - Verify validation error when title is missing', async ({ page }) => {
    await page.goto('/recipes/new')

    await page.getByLabel('Ingredients').fill('200g pasta')
    await page.getByLabel('Instructions').fill('Cook pasta')
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText(/title.*required/i)).toBeVisible()
  })

  test('C48 - Verify validation error when no ingredients are provided', async ({ page }) => {
    await page.goto('/recipes/new')

    await page.getByLabel('Title').fill('Test Recipe')
    await page.getByLabel('Instructions').fill('Cook something')
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText(/ingredient.*required/i)).toBeVisible()
  })

  test('C49 - Verify recipe is saved with all valid fields', async ({ page }) => {
    await page.goto('/recipes/new')

    await page.getByLabel('Title').fill('Pasta Carbonara')
    await page.getByLabel('Ingredients').fill('200g spaghetti')
    await page.getByLabel('Instructions').fill('Boil water and cook pasta')
    await page.getByLabel('Serving Size').fill('4')
    await page.getByLabel('Prep Time').fill('10')
    await page.getByLabel('Cook Time').fill('20')
    await page.getByLabel('Difficulty').selectOption('Medium')
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText(/recipe saved|confirmation/i)).toBeVisible()
  })

  test('C50 - Verify validation error when no instruction steps are provided', async ({ page }) => {
    await page.goto('/recipes/new')

    await page.getByLabel('Title').fill('Test Recipe')
    await page.getByLabel('Ingredients').fill('200g pasta')
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText(/instruction.*required/i)).toBeVisible()
  })

})
