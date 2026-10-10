# Get2Pro Playwright Tests

End-to-end test automation project for the Get2Pro website, built with
Playwright and TypeScript.

The project covers critical user journeys, navigation, search, product
pages, payment links, QR codes, form validation, cookie consent and
analytics behaviour, responsive behaviour, and HTTP response checks.

## Tech Stack

- Playwright
- TypeScript
- Node.js
- ESLint
- Prettier
- GitHub Actions

## Test Coverage

The automated test suite includes:

- Homepage smoke tests
- Main and footer navigation
- English/Lithuanian language switching
- Search behaviour and no-results handling
- Product archive and product detail pages
- Swedbank payment links
- Support QR code validation
- Contact and enquiry form validation
- News navigation
- Instagram embed validation
- Mobile viewport coverage
- 404 page handling
- Cookie consent and analytics behaviour
  - Analytics remains disabled when consent is denied
  - Google Analytics cookies are created after analytics consent is granted
  - Custom consent preferences are persisted correctly
  - Previously granted analytics consent can be withdrawn
- HTTP response checks for public pages

Some production flows are intentionally not automated when they would
cause real side effects, such as sending enquiry emails or completing
payments.

## Running Tests Locally

Install dependencies:

```bash
npm ci
```

Install Chromium:

```bash
npx playwright install chromium
```

Run the full test suite:

```bash
npx playwright test
```

Open the HTML report:

```bash
npx playwright show-report
```

## Code Quality

Run formatting check:

```bash
npm run format:check
```

Run ESLint:

```bash
npm run lint
```

Run TypeScript type checking:

```bash
npm run typecheck
```

Before committing changes, run the full validation:

```bash
npm run format:check
npm run lint
npm run typecheck
npx playwright test
```

## CI

GitHub Actions runs the complete validation pipeline on:

- pull requests to `main`
- pushes to `main`
- a nightly schedule

The CI pipeline:

1.  installs project dependencies
2.  installs Playwright Chromium
3.  checks formatting
4.  runs ESLint
5.  runs TypeScript type checking
6.  runs the complete Playwright test suite

Playwright HTML reports are uploaded as GitHub Actions artifacts and
retained for 14 days.

Screenshots are captured on test failure and Playwright traces are
retained for the first retry.

## Project Structure

```text
.github/workflows/   GitHub Actions workflow
tests/               Playwright test suites
tests/helpers/       Shared test helpers
playwright.config.ts Playwright configuration
eslint.config.mjs    ESLint configuration
tsconfig.json        TypeScript configuration
```

Tests are grouped by functionality to keep the suite easy to navigate
and maintain.

## Test Design

The project favours:

- user-facing roles and accessible locators
- scoped locators for reusable page sections
- meaningful assertions instead of implementation details
- avoiding arbitrary timeouts
- avoiding forced clicks unless technically necessary
- testing validation without causing unwanted production side effects

The suite currently runs in Chromium.

## AI-Assisted Development

AI tools were used as part of the development workflow for tasks such as
generating initial test implementations, suggesting refactoring options,
and analysing test failures.

AI-generated code was treated as a starting point rather than accepted
automatically. Changes were reviewed, executed locally, and validated
through formatting, linting, TypeScript checks, and Playwright tests
before being committed.

Failures were investigated before changing assertions or locators, with
preference given to fixing the underlying test or application behaviour
rather than weakening tests to make them pass.

## CI and Git Workflow

Development uses Git feature branches and pull requests for larger
changes such as CI configuration and test infrastructure.

Smaller maintenance changes may be committed directly to `main`.

GitHub Actions provides an additional validation layer before and after
changes are merged.
