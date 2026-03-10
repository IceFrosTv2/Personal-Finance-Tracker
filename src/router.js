import { Dashboard } from "./components/pages/dashboard.js";
import { TransactionsList } from "./components/pages/transactions/transactions-list.js";
import { IncomeCategories } from "./components/pages/incomes/income-categories.js";
import { ExpenseCategories } from "./components/pages/expenses/expense-categories.js";
import { Common } from "./components/common.js";
import { IncomeCreate } from "./components/pages/incomes/income-create";
import { IncomeEdit } from "./components/pages/incomes/income-edit";
import { ExpenseCreate } from "./components/pages/expenses/expense-create";
import { ExpenseEdit } from "./components/pages/expenses/expense-edit";
import { TransactionsCreate } from "./components/pages/transactions/transactions-create";
import { TransactionsEdit } from "./components/pages/transactions/transactions-edit";
import { Login } from "./components/pages/auth/login";
import { Register } from "./components/pages/auth/register";

export class Router {
    constructor () {
        this.titlePageElement = document.getElementById('title-page');
        this.contentPageElement = document.getElementById('app');
        this.userName = null;

        this.openNewRoute = this.openNewRoute.bind(this);
        this.initEvents();

        this.routes = [
            {
                route: '/',
                title: 'Main',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard(this.openNewRoute)
                },
            },
            {
                route: '/login',
                title: 'Sign In',
                filePathTemplate: '/templates/pages/auth/login.html',
                load: () => {
                    new Login(this.openNewRoute)
                },
            },
            {
                route: '/register',
                title: 'Sign Up',
                filePathTemplate: '/templates/pages/auth/register.html',
                load: () => {
                    new Register(this.openNewRoute)
                },
            },
            {
                route: '/transactions',
                title: 'Transactions',
                filePathTemplate: '/templates/pages/transactions/transactions-list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new TransactionsList(this.openNewRoute)
                },
            },
            {
                route: '/transactions/create',
                title: 'Create Transaction',
                filePathTemplate: '/templates/pages/transactions/transactions-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new TransactionsCreate(this.openNewRoute)
                },
            },
            {
                route: '/transactions/edit',
                title: 'Edit Transaction',
                filePathTemplate: '/templates/pages/transactions/transactions-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new TransactionsEdit(this.openNewRoute)
                },
            },
            {
                route: '/category/income',
                title: 'Income Categories',
                filePathTemplate: '/templates/pages/incomes/income-categories.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCategories(this.openNewRoute)
                },
            },
            {
                route: '/category/income/create',
                title: 'Create Income',
                filePathTemplate: '/templates/pages/incomes/income-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate(this.openNewRoute)
                },
            },
            {
                route: '/category/income/edit',
                title: 'Edit Income',
                filePathTemplate: '/templates/pages/incomes/income-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit(this.openNewRoute)
                },
            },
            {
                route: '/category/expense',
                title: 'Expense Categories',
                filePathTemplate: '/templates/pages/expenses/expense-categories.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseCategories(this.openNewRoute)
                },
            },
            {
                route: '/category/expense/create',
                title: 'Create Expense',
                filePathTemplate: '/templates/pages/expenses/expense-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseCreate(this.openNewRoute)
                },
            },
            {
                route: '/category/expense/edit',
                title: 'Edit Expense',
                filePathTemplate: '/templates/pages/expenses/expense-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseEdit(this.openNewRoute)
                },
            },
        ];
    }

    initEvents () {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async openNewRoute (url) {
        const currentRoute = location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute)
    };

    async activateRoute (e, oldRoute = null) {
        if ( oldRoute ) {
            // const currentRoute = this.routes.find(item => item.route === oldRoute);

        }

        const urlRoute = location.pathname;
        const newRoute = this.routes.find(route => route.route === urlRoute);

        if ( !newRoute ) {
            return
        }

        if ( newRoute.title ) {
            this.titlePageElement.textContent = newRoute.title + ' | Lumincoin Finance';
        }

        if ( newRoute.useLayout ) {
            this.contentPageElement.innerHTML = await fetch(newRoute.useLayout)
                .then(response => response.text());

            Common.initCategoryLayout();
        }

        if ( newRoute.filePathTemplate ) {
            const targetElement = newRoute.useLayout
                ? document.getElementById('content__main')
                : this.contentPageElement;

            targetElement.innerHTML = await fetch(newRoute.filePathTemplate)
                .then(response => response.text());

            if ( newRoute.load ) {
                newRoute.load();
            }
        }
    }
}
