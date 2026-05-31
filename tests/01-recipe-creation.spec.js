// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Recipe Creation', () => {

  test('C46 - Verify recipe creation form displays all required fields', async ({ page }) => {
    await page.goto('/recipes/new')

    await expect(page.getByRole('textbox', { name: 'Recipe Title' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Ingredient' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Instructions' })).toBeVisible()
    await expect(page.getByRole('spinbutton', { name: 'Serving Size' })).toBeVisible()
    await expect(page.getByRole('spinbutton', { name: 'Prep Time (min)' })).toBeVisible()
    await expect(page.getByRole('spinbutton', { name: 'Cook Time (min)' })).toBeVisible()
    await expect(page.getByRole('combobox', { name: 'Difficulty' })).toBeVisible()
  })

  test('C47 - Verify validation error when title is missing', async ({ page }) => {
    await page.goto('/recipes/new')

    await page.getByRole('textbox', { name: 'Ingredient' }).fill('200g pasta')
    await page.getByRole('textbox', { name: 'Instructions' }).fill('Cook pasta')
    await page.getByRole('button', { name: 'Save Recipe' }).click()

    await expect(page.getByText(/title.*required/i)).toBeVisible()
  })

  test('C48 - Verify validation error when no ingredients are provided', async ({ page }) => {
    await page.goto('/recipes/new')

    await page.getByRole('textbox', { name: 'Recipe Title' }).fill('Test Recipe')
    await page.getByRole('textbox', { name: 'Instructions' }).fill('Cook something')
    await page.getByRole('button', { name: 'Save Recipe' }).click()

    await expect(page.getByText(/ingredient.*required/i)).toBeVisible()
  })

  test('C49 - Verify recipe is saved with all valid fields', async ({ page }) => {
    await page.goto('/recipes/new')

    await page.getByRole('textbox', { name: 'Recipe Title' }).fill('Pasta Carbonara')
    await page.getByRole('textbox', { name: 'Ingredient' }).fill('200g spaghetti')
    await page.getByRole('textbox', { name: 'Instructions' }).fill('Boil water and cook pasta')
    await page.getByRole('spinbutton', { name: 'Serving Size' }).fill('4')
    await page.getByRole('spinbutton', { name: 'Prep Time (min)' }).fill('10')
    await page.getByRole('spinbutton', { name: 'Cook Time (min)' }).fill('20')
    await page.getByRole('combobox', { name: 'Difficulty' }).selectOption('Medium')
    await page.getByRole('button', { name: 'Save Recipe' }).click()

    await expect(page.getByText(/recipe saved|saved successfully/i)).toBeVisible()
  })

  test('C50 - Verify validation error when no instruction steps are provided', async ({ page }) => {
    await page.goto('/recipes/new')

    await page.getByRole('textbox', { name: 'Recipe Title' }).fill('Test Recipe')
    await page.getByRole('textbox', { name: 'Ingredient' }).fill('200g pasta')
    await page.getByRole('button', { name: 'Save Recipe' }).click()

    await expect(page.getByText(/instruction.*required/i)).toBeVisible()
  })

})
