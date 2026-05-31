// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Meal Planning', () => {

  test('C56 - Verify meal plan creation with valid Person Count and Planning Period', async ({ page }) => {
    await page.goto('/meal-plan')
    await page.getByRole('button', { name: 'New Plan' }).click()

    // Step 1: Plan Details
    await page.getByRole('spinbutton', { name: 'Number of People' }).fill('4')
    await page.getByRole('spinbutton', { name: 'Planning Period (days)' }).fill('7')
    await page.getByRole('button', { name: /Next/i }).click()

    // Wait for plan generation to complete and verify days are displayed
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible({ timeout: 15000 })
  })

  test('C57 - Verify validation error for invalid Person Count', async ({ page }) => {
    await page.goto('/meal-plan')
    await page.getByRole('button', { name: 'New Plan' }).click()

    await page.getByRole('spinbutton', { name: 'Number of People' }).fill('0')
    await page.getByRole('button', { name: /Next/i }).click()

    await expect(page.getByText(/at least 1|must be.*positive|invalid|minimum/i)).toBeVisible()
  })

  test('C58 - Verify validation error for Planning Period exceeding 30 days', async ({ page }) => {
    await page.goto('/meal-plan')
    await page.getByRole('button', { name: 'New Plan' }).click()

    await page.getByRole('spinbutton', { name: 'Planning Period (days)' }).fill('31')
    await page.getByRole('button', { name: /Next/i }).click()

    await expect(page.getByText(/between 1 and 30|maximum.*30|exceed/i)).toBeVisible()
  })

})
