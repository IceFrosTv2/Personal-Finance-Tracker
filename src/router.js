import { Dashboard } from "./components/pages/dashboard.js";
import { OperationsList } from "./components/pages/operations/operations-list.js";
import { Layout } from "./components/layout.js";
import { OperationsCreate } from "./components/pages/operations/operations-create";
import { OperationsEdit } from "./components/pages/operations/operations-edit";
import { Login } from "./components/pages/auth/login";
import { Register } from "./components/pages/auth/register";
import config from "./config/config";
import { TokensUtils } from "./utils/tokens-utils";
import { BaseCategories } from "./components/pages/base-categories/base-categories";
import { BaseCategoriesCreate } from "./components/pages/base-categories/base-categories-create";
import { BaseCategoriesEdit } from "./components/pages/base-categories/base-categories-edit";

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
                useLayout: '/templates/layout.html',
                load: () => {
                    new BaseCategories(this.openNewRoute, 'income')
                },
            },
            {
                route: routes.categories.income.create,
                title: 'Create Income',
                useLayout: '/templates/layout.html',
                load: () => {
                    new BaseCategoriesCreate(this.openNewRoute, 'income')
                },
            },
            {
                route: routes.categories.income.edit,
                title: 'Edit Income',
                useLayout: '/templates/layout.html',
                load: () => {
                    new BaseCategoriesEdit(this.openNewRoute, 'income')
                },
            },
            {
                route: routes.categories.expense.list,
                title: 'Expense Categories',
                useLayout: '/templates/layout.html',
                load: () => {
                    new BaseCategories(this.openNewRoute, 'expense')
                },
            },
            {
                route: routes.categories.expense.create,
                title: 'Create Expense',
                useLayout: '/templates/layout.html',
                load: () => {
                    new BaseCategoriesCreate(this.openNewRoute, 'expense')
                },
            },
            {
                route: routes.categories.expense.edit,
                title: 'Edit Expense',
                useLayout: '/templates/layout.html',
                load: () => {
                    new BaseCategoriesEdit(this.openNewRoute, 'expense')
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
        const refreshToken = TokensUtils.getAuthInfo(TokensUtils.refreshTokenKey);
        if ( newRoute.useLayout && !refreshToken ) return await this.openNewRoute('/login')
        if ( !newRoute.useLayout ) {
            this.contentMain = null;
            if ( refreshToken && newRoute.route !== routes.notFound ) return await this.openNewRoute('/')
        }

        if ( newRoute.title ) {
            this.titlePageElement.textContent = newRoute.title + ' | Lumincoin Finance';
        }

        if ( newRoute.useLayout ) {
            if ( !this.contentMain ) {
                this.contentApp.innerHTML = await fetch(newRoute.useLayout)
                    .then(response => response.text());
                await Layout.initCategoryLayout();
                Layout.initSidebarToggle();
                this.contentMain = document.getElementById('content__main')
            }
            Layout.closeSidebar();
            Layout.syncCategoryLayout();
            Layout.activateMenuItem(newRoute);
        }

        if ( newRoute.filePathTemplate ) {
            (this.contentMain || this.contentApp).innerHTML = await fetch(newRoute.filePathTemplate)
                .then(response => response.text());
        }

        if ( newRoute.load ) {
            newRoute.load();
        }
    }
}
