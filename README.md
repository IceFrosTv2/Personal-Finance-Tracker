# Lumincash — Personal Finance Tracker

A single-page application for tracking personal income and expenses. Manage categories, view transactions, and analyze your budget through charts.

> [Документация на русском языке](./README.ru.md)

---

## Tech Stack

- **HTML5** — page templates
- **SCSS** — styling (split into partials)
- **TypeScript** — app logic, routing, components
- **Vite** — bundler
- **npm** — package manager
- **Bootstrap 5** + **Bootstrap Icons** — UI components and icons
- **Chart.js** — income/expense pie charts
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

Create a `.env` file in the project root:

```env
VITE_HOST="http://localhost:3000"
```

`VITE_HOST` — base URL of the backend API server.

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
│       ├── layout.html                     # Main layout with sidebar
│       └── pages/
│           ├── auth/
│           │   ├── login.html
│           │   └── register.html
│           ├── dashboard.html
│           ├── 404.html
│           └── operations/
│               └── operations-list.html
├── src/
│   ├── main.ts                             # Entry point
│   ├── router.ts                           # Client-side router
│   ├── config/
│   │   └── config.ts                       # API base URL and route names
│   ├── services/
│   │   ├── auth-service.ts                 # Login, register, logout
│   │   ├── categories-service.ts           # Category CRUD
│   │   └── operations-service.ts           # Operation CRUD + filters
│   ├── components/
│   │   ├── layout.ts                       # Sidebar, balance, menu state
│   │   └── pages/
│   │       ├── auth/
│   │       │   ├── login.ts
│   │       │   └── register.ts
│   │       ├── dashboard.ts                # Charts with period filtering
│   │       ├── base-filters-page.ts        # Base class: period filter logic
│   │       ├── operations/
│   │       │   ├── operations-list.ts      # Transaction list with filters
│   │       │   └── operations-form.ts      # Create and edit operations
│   │       └── base-categories/
│   │           ├── base-categories.ts      # Category list (used for both income/expense)
│   │           ├── base-categories-create.ts
│   │           └── base-categories-edit.ts
│   ├── utils/
│   │   ├── tokens-utils.ts                 # Token storage and refresh logic
│   │   ├── http-utils.ts                   # HTTP wrapper with auth headers
│   │   ├── validator-form.ts               # Form validation
│   │   ├── toast-utils.ts                  # Error notifications
│   │   ├── modal-utils.ts                  # Delete confirmation modal
│   │   ├── date-picker.ts                  # Tempus Dominus wrapper
│   │   └── select-period.ts                # Period filter button state
│   └── styles/
│       ├── styles.scss                     # Styles entry point
│       ├── _auth.scss
│       ├── _layout.scss
│       ├── _dashboard.scss
│       └── _operations.scss
└── index.html
```

---

## Features

- Registration and login with client-side form validation
- Dashboard with balance overview and income/expense pie charts
- Period filtering: today / week / month / year / all time / custom date range
- Income and expense category management (create, edit, delete with confirmation)
- Transaction list with the same period filters
- Create and edit transactions with type, category, amount, date, and comment
- Balance updates automatically after any create, edit, or delete action
- Operations with deleted categories are shown as "uncategorized" in charts
- Client-side routing without page reload
- Responsive layout: collapsible sidebar on desktop, slide-in drawer on mobile (< 650px)
- Dark theme support (toggled via button in the sidebar, preference saved in localStorage)
- Pagination for the transaction list (configurable page size, Previous / Next navigation)

---

## License

[MIT](./LICENSE)

---

## Author

**Frontend Developer** — Andrei
GitHub: [@IceFrosTv2](https://github.com/icefrostv2)
