# Recipe Creator - E2E Tests

Playwright end-to-end test suite for the Recipe Creator application with TestRail integration.

## Prerequisites

- Node.js 18+
- Recipe Creator app running locally (frontend on `http://localhost:5173`, backend on `http://localhost:3000`)
- Playwright browsers installed

## Setup

```bash
npm install
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run a specific test file
npx playwright test tests/04-search-and-filtering.spec.js

# Run in headed mode (visible browser)
npx playwright test --headed

# Run with slow motion (easier to follow)
npx playwright test --headed --slowmo=500

# Open Playwright UI mode (interactive)
npm run test:ui

# View HTML report from last run
npm run test:report
```

## Test Structure

| File | Area | Test Cases |
|------|------|------------|
| `01-recipe-creation.spec.js` | Recipe Creation & Validation | C46–C50 |
| `02-recipe-generation.spec.js` | AI Recipe Generation | C51–C55 |
| `03-meal-planning.spec.js` | Meal Planning | C56–C58 |
| `04-search-and-filtering.spec.js` | Search & Filtering | C59–C60 |
| `05-editing-and-deletion.spec.js` | Recipe Editing & Deletion | C61–C63 |
| `06-remaining-features.spec.js` | Dietary, Scaling, Pantry, Shopping, Favorites, i18n, Email, UI | C64–C75 |

## TestRail Integration

Test cases are mapped to TestRail using the `C{id}` prefix in test names (e.g., `C59`). Results are reported to:

- **Instance**: `https://qaericka.testrail.io`
- **Project ID**: 1 (Sample Project)

### Jira Mapping

| TestRail Cases | Jira Story |
|----------------|------------|
| C46–C50 | SCRUM-5 (Recipe Creation) |
| C51–C55 | SCRUM-6 (Recipe Generation) |
| C56–C58 | SCRUM-8 (Meal Planning) |
| C59–C60 | SCRUM-7 (Recipe Search and Filtering) |
| C61–C63 | SCRUM-9 (Recipe Editing and Deletion) |
| C64 | SCRUM-10 (Dietary Profile Management) |

## Configuration

- `playwright.config.js` — Playwright settings, base URL, reporters, and browser config
- Base URL defaults to `http://localhost:5173`
