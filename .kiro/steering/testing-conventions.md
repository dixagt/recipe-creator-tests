---
inclusion: auto
---

# Testing Conventions

## Test File Naming

- Files are numbered by feature area: `{NN}-{feature-name}.spec.js`
- Each test name starts with the TestRail case ID: `C{id} - {description}`

## Selectors

Use Playwright best practices for selectors in this order of preference:

1. `getByRole()` — accessible roles (button, link, combobox, searchbox, list, listitem)
2. `getByLabel()` — form inputs by label text
3. `getByText()` — visible text content
4. `getByPlaceholder()` — input placeholders
5. `locator('[data-testid="..."]')` — only when no semantic selector works

## App Structure

The Recipe Creator app uses these accessible patterns:

- Navigation: `getByRole('navigation', { name: 'Main navigation' })`
- Recipe list: `getByRole('list', { name: 'Recipe list' })` with `getByRole('listitem')` children
- Search: `getByRole('searchbox', { name: 'Search recipes' })`
- Filters: `getByRole('combobox', { name: 'Meal Type' })`, `getByRole('combobox', { name: 'Difficulty' })`
- Dietary checkboxes: `getByRole('checkbox', { name: 'Filter by vegetarian' })`

## Waiting Strategies

- Always wait for data to load before interacting: `await expect(locator).not.toHaveCount(0, { timeout: 10000 })`
- For filtering, wait for the expected state rather than using fixed timeouts
- Use `await page.waitForTimeout()` sparingly and only to let the page stabilize after load

## TestRail Integration

- Test case IDs in test names (C46, C59, etc.) map to TestRail case IDs
- The `refs` field in TestRail links cases to Jira stories (SCRUM-X)
- Results can be submitted via the TestRail MCP tools or the playwright-testrail-reporter

## App URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- Both must be running for tests to pass
