# Lumincash — Personal Finance Tracker

A single-page application for tracking personal income and expenses. Manage categories, view transactions, and analyze your budget through charts.

> [Документация на русском языке](./README.ru.md)

---

## Tech Stack

- **HTML5** — page templates
- **SCSS** — styling (split into partials)
- **JavaScript (ES6+)** — app logic, routing, components
- **Vite** — bundler
- **npm** — package manager
- **Bootstrap 5** + **Bootstrap Icons** — UI components and icons
- **Chart.js** — income/expense charts
- **Choices.js** — custom select elements
- **Tempus Dominus** — date picker

---

## Installation & Setup

```bash
# Clone the repository
git clone https://github.com/IceFrosTv2/Personal-Finance-Tracker.git
cd frontend

# Install dependencies
npm install
```

### Environment variables

A `.env` file must be placed in the project root with the following content:

```env
VITE_HOST="http://localhost:3000"
```

`VITE_HOST` — the base URL of the backend API server.

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
frontend/
├── public/
│   └── templates/
│       ├── layout.html                  # Main layout with sidebar
│       └── pages/
│           ├── auth/
│           │   ├── login.html
│           │   └── register.html
│           ├── dashboard.html
│           ├── 404.html
│           ├── operations/
│           │   ├── operations-list.html
│           │   ├── operations-create.html
│           │   └── operations-edit.html
│           ├── incomes/
│           │   ├── income-categories.html
│           │   ├── income-create.html
│           │   └── income-edit.html
│           └── expenses/
│               ├── expense-categories.html
│               ├── expense-create.html
│               └── expense-edit.html
├── src/
│   ├── main.js                          # Entry point
│   ├── router.js                        # Client-side router
│   ├── config/
│   │   └── config.js                    # App configuration (API, routes)
│   ├── services/
│   │   └── auth-service.js              # Auth API calls (login, register, logout)
│   ├── components/
│   │   ├── layout.js                    # Sidebar and menu logic
│   │   └── pages/
│   │       ├── auth/
│   │       │   ├── login.js
│   │       │   └── register.js
│   │       ├── dashboard.js
│   │       ├── operations/
│   │       │   ├── operations-list.js
│   │       │   ├── operations-create.js
│   │       │   └── operations-edit.js
│   │       ├── base-categories.js       # Base class for category pages
│   │       ├── incomes/
│   │       │   ├── income-categories.js
│   │       │   ├── income-create.js
│   │       │   └── income-edit.js
│   │       └── expenses/
│   │           ├── expense-categories.js
│   │           ├── expense-create.js
│   │           └── expense-edit.js
│   ├── utils/
│   │   ├── tokens-utils.js               # Token storage and refresh logic
│   │   ├── http-utils.js               # HTTP request wrapper with auth
│   │   ├── validator-form.js           # Universal form validator
│   │   ├── date-picker.js              # Date picker initialization
│   │   └── select-period.js            # Period filter (week/month/year/all)
│   └── styles/
│       ├── styles.scss                  # Styles entry point
│       ├── _auth.scss
│       ├── _layout.scss
│       ├── _dashboard.scss
│       └── _operations.scss
└── index.html
```

---

## Features

- Registration and login with client-side form validation
- Dashboard with balance overview
- Income and expense category management (create, edit, delete with modal confirmation)
- Transaction list with period filtering (week / month / year / all time / custom range)
- Create and edit transactions
- Income/expense visualization with pie charts (Chart.js)
- Client-side routing without page reload
- Responsive layout: collapsible sidebar on desktop, slide-in drawer with overlay on mobile (< 650px)

---

## Roadmap

- Implement pagination for the transaction list
- Add CSV/Excel data export
- Add dark theme support

---

## License

[MIT](./LICENSE)

---

## Author

**Frontend Developer** — Andrei
GitHub: [@IceFrosTv2](https://github.com/icefrostv2)
