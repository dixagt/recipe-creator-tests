// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Meal Planning', () => {

  test('C56 - Verify meal plan creation with valid Person Count and Planning Period', async ({ page }) => {
    await page.goto('/meal-plan/new')

    await page.getByLabel('Person Count').fill('4')
    await page.getByLabel('Planning Period').fill('7')
    await page.getByRole('button', { name: 'Generate Plan' }).click()

    // Verify 7 days are displayed
    const days = page.locator('[data-testid="meal-plan-day"]')
    await expect(days).toHaveCount(7)

    // Verify each day has 3 meal slots
    for (let i = 0; i < 7; i++) {
      await expect(days.nth(i).locator('[data-testid="meal-slot"]')).toHaveCount(3)
    }
  })

  test('C57 - Verify validation error for invalid Person Count', async ({ page }) => {
    await page.goto('/meal-plan/new')

    await page.getByLabel('Person Count').fill('0')
    await page.getByRole('button', { name: 'Generate Plan' }).click()

    await expect(page.getByText(/person count.*at least 1/i)).toBeVisible()
  })

  test('C58 - Verify validation error for Planning Period exceeding 30 days', async ({ page }) => {
    await page.goto('/meal-plan/new')

    await page.getByLabel('Planning Period').fill('31')
    await page.getByRole('button', { name: 'Generate Plan' }).click()

    await expect(page.getByText(/planning period.*between 1 and 30/i)).toBeVisible()
  })

})
