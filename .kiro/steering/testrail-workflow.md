---
inclusion: auto
---

# TestRail Workflow

## Running Tests and Reporting Results

When asked to run tests and report to TestRail:

1. Run the Playwright tests using `npx playwright test {file} --headed --reporter=list`
2. Create or identify the TestRail test run
3. Submit results using `add_results_for_cases` with the run ID
4. Use status_id 1 for passed, 5 for failed

## TestRail Project

- Project ID: 1 (Sample Project)
- Instance: https://qaericka.testrail.io

## Case ID to Jira Story Mapping

| Cases | Jira Story | Feature |
|-------|-----------|---------|
| C46–C50 | SCRUM-5 | Recipe Creation |
| C51–C55 | SCRUM-6 | Recipe Generation |
| C56–C58 | SCRUM-8 | Meal Planning |
| C59–C60 | SCRUM-7 | Search and Filtering |
| C61–C63 | SCRUM-9 | Editing and Deletion |
| C64 | SCRUM-10 | Dietary Profile |
| C65, C75 | — | Ingredient Scaling |
| C66 | — | Pantry-Based Meal Plan |
| C67 | — | Missing Ingredients |
| C68 | — | Shopping List |
| C69 | — | Favorite Meals |
| C70 | — | Multi-Language |
| C71 | — | Shopping List Delivery Day |
| C72 | — | UI Design |
| C73–C74 | — | Email Delivery |

## Linking Test Cases to Jira

Use the `refs` field when updating test cases:
```
update_case(case_id, { refs: "SCRUM-7" })
```

Multiple references can be comma-separated: `"SCRUM-7, SCRUM-10"`
