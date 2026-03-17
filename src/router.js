import { Dashboard } from "./components/pages/dashboard.js";
import { OperationsList } from "./components/pages/operations/operations-list.js";
import { IncomeCategories } from "./components/pages/incomes/income-categories.js";
import { ExpenseCategories } from "./components/pages/expenses/expense-categories.js";
import { Layout } from "./components/layout.js";
import { IncomeCreate } from "./components/pages/incomes/income-create";
import { IncomeEdit } from "./components/pages/incomes/income-edit";
import { ExpenseCreate } from "./components/pages/expenses/expense-create";
import { ExpenseEdit } from "./components/pages/expenses/expense-edit";
import { OperationsCreate } from "./components/pages/operations/operations-create";
import { OperationsEdit } from "./components/pages/operations/operations-edit";
import { Login } from "./components/pages/auth/login";
import { Register } from "./components/pages/auth/register";
import config from "./config/config";
import { AuthUtils } from "./utils/auth-utils";

const { routes } = config;

export class Router {
    constructor () {
        this.titlePageElement = document.getElementById('title-page');
        this.contentApp = document.getElementById('app');

        this.openNewRoute = this.openNewRoute.bind(this);
        this.initEvents();

        this.routes = [
            {
                route: routes.home,
                title: 'Main',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard(this.openNewRoute)
                },
            },
            {
                route: routes.login,
                title: 'Sign In',
                filePathTemplate: '/templates/pages/auth/login.html',
                load: () => {
                    new Login(this.openNewRoute)
                },
            },
            {
                route: routes.register,
                title: 'Sign Up',
                filePathTemplate: '/templates/pages/auth/register.html',
                load: () => {
                    new Register(this.openNewRoute)
                },
            },
            {
                route: routes.notFound,
                title: '404',
                filePathTemplate: '/templates/pages/404.html',
            },
            {
                route: routes.operations.list,
                title: 'Operations',
                filePathTemplate: '/templates/pages/operations/operations-list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsList(this.openNewRoute)
                },
            },
            {
                route: routes.operations.create,
                title: 'Create Operation',
                filePathTemplate: '/templates/pages/operations/operations-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsCreate(this.openNewRoute)
                },
            },
            {
                route: routes.operations.edit,
                title: 'Edit Operation',
                filePathTemplate: '/templates/pages/operations/operations-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsEdit(this.openNewRoute)
                },
            },
            {
                route: routes.categories.income.list,
                title: 'Income Categories',
                filePathTemplate: '/templates/pages/incomes/income-categories.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCategories(this.openNewRoute)
                },
            },
            {
                route: routes.categories.income.create,
                title: 'Create Income',
                filePathTemplate: '/templates/pages/incomes/income-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate(this.openNewRoute)
                },
            },
            {
                route: routes.categories.income.edit,
                title: 'Edit Income',
                filePathTemplate: '/templates/pages/incomes/income-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit(this.openNewRoute)
                },
            },
            {
                route: routes.categories.expense.list,
                title: 'Expense Categories',
                filePathTemplate: '/templates/pages/expenses/expense-categories.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseCategories(this.openNewRoute)
                },
            },
            {
                route: routes.categories.expense.create,
                title: 'Create Expense',
                filePathTemplate: '/templates/pages/expenses/expense-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseCreate(this.openNewRoute)
                },
            },
            {
                route: routes.categories.expense.edit,
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
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute (url) {
        const currentRoute = location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute)
    };

    async clickHandler (e) {
        let element = null
        if ( e.target.nodeName === 'A' ) {
            element = e.target;
        } else if ( e.target.parentNode.nodeName === "A" ) {
            element = e.target.parentNode;
        }

        if ( element ) {
            e.preventDefault();

            const url = element.href.replace(window.location.origin, '');

            if ( element.hostname !== window.location.hostname ) {
                window.open(element.href, '_blank');
                return;
            }
            if ( !url || (location.pathname === url.replace('#', ''))
                || url.startsWith('javascript:void(0)') ) return;

            await this.openNewRoute(url);
        }
    }

    async activateRoute () {
        const urlRoute = location.pathname;
        const newRoute = this.routes.find(route => route.route === urlRoute);

        if ( !newRoute ) {
            return await this.openNewRoute(routes.notFound)
        }
        const refreshToken = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);
        if ( newRoute.useLayout && !refreshToken ) return await this.openNewRoute('/login')
        if ( !newRoute.useLayout ) {
            this.contentMain = null;
            if (refreshToken && newRoute.route !== routes.notFound ) return await this.openNewRoute('/')
        }

        if ( newRoute.title ) {
            this.titlePageElement.textContent = newRoute.title + ' | Lumincoin Finance';
        }

        if ( newRoute.filePathTemplate ) {
            if ( newRoute.useLayout ) {
                if ( !this.contentMain ) {
                    this.contentApp.innerHTML = await fetch(newRoute.useLayout)
                        .then(response => response.text());
                    Layout.initCategoryLayout();
                    Layout.initSidebarToggle();
                    this.contentMain = document.getElementById('content__main')
                }
                Layout.closeSidebar();
                Layout.syncCategoryLayout();
                Layout.activateMenuItem(newRoute);
            }

            (this.contentMain || this.contentApp).innerHTML = await fetch(newRoute.filePathTemplate)
                .then(response => response.text());

            if ( newRoute.load ) {
                newRoute.load();
            }
        }
    }
}
