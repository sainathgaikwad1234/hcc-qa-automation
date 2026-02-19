# HCC QA Automation

Test automation framework for the HCC (5280 Human Care Center) EMR Portal using Playwright.

## Setup

1. Install dependencies:
   ```bash
   npm install
   npx playwright install chromium
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

## Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests headless |
| `npm run test:headed` | Run with visible browser |
| `npm run test:ui` | Interactive UI mode |
| `npm run test:debug` | Debug mode with inspector |
| `npm run test:report` | View HTML report |
| `npm run test:codegen` | Record new tests via browser |
| `npm run test:smoke` | Run P0 critical tests only |

## Project Structure

```
hcc-qa-automation/
├── tests/
│   ├── e2e/              # End-to-end UI tests
│   │   ├── dashboard/    # Dashboard tests
│   │   └── settings/     # Settings tests
│   ├── fixtures/         # Auth setup, custom fixtures, test data
│   ├── utils/            # Helper utilities
│   └── api-disabled/     # Disabled/WIP API tests
├── .auth/                # Saved auth session (gitignored)
├── .github/workflows/    # CI/CD pipeline
├── playwright.config.ts  # Playwright configuration
└── .env                  # Credentials (gitignored)
```

## Writing Tests

```typescript
import { test, expect } from '../fixtures/merged-fixtures';

test.describe('Feature Name @p1', () => {
  test('should do something', async ({ authenticatedPage: page }) => {
    // page is already authenticated
    await page.goto('/some-page');
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

## Test Priority Tags

- `@p0` - Critical smoke tests (run on every push)
- `@p1` - Important regression tests
- `@p2` - Nice-to-have coverage
