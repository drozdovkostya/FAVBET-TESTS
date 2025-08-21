# Favbet Automated Tests

This project contains automated UI and API tests for [favbet.ua](https://www.favbet.ua) using [Playwright](https://playwright.dev/) and TypeScript.

## 📁 Project Structure

```
favbet-tests/
├── pages/           # Page Object Models for UI tests
│   ├── LivePage.ts
│   ├── LoginPage.ts
│   ├── MainPage.ts
│   └── SettingsPage.ts
├── tests/           # Test suites
│   ├── api-test-solution.spec.ts
│   └── ui-test-solution.spec.ts
├── package.json     # Project dependencies and scripts
└── tsconfig.json    # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/drozdovkostya/FAVBET-TESTS.git
    cd favbet-tests
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Install Playwright browsers:
    ```sh
    npx playwright install
    ```

### To view existing report from last run

1. Extract archive playwright-report.zip
2. Run command in same path where playwright-report: npx playwright show-report

### Environment Variables

Set your credentials in environment variables before running tests:

- `USER` — your Favbet username/email
- `PASS` — your Favbet password

You can set them in your terminal session:
```sh
set USER=your_username
set PASS=your_password
```
Or use a `.env` file with [dotenv-cli](https://www.npmjs.com/package/dotenv-cli).

## 🧪 Running Tests

### Run all tests

```sh
npx playwright test
```

### Run a specific test file

```sh
npx playwright test tests/ui-test-solution.spec.ts
```

### Run tests with UI

```sh
npx playwright test --ui
```

## 📝 Test Overview

- **UI Tests** (`tests/ui-test-solution.spec.ts`)
  - Login and navigation
  - Favorites management (add/remove/check)
  - YouTube social network integration
  - Settings configuration (language, theme)

- **API Tests** (`tests/api-test-solution.spec.ts`)
  - Bonuses API
  - Instant Games Favorites API

## 🏗️ Page Objects

Reusable page objects are in the `pages/` directory:
- `LoginPage` — handles login flow
- `MainPage` — main navigation and social links
- `LivePage` — live games and favorites management
- `SettingsPage` — user settings and preferences

## 📸 Screenshots

Some tests take screenshots for visual regression. Screenshots are saved in the default Playwright output directory.
