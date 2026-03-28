import {Dashboard} from "./components/pages/dashboard";
import {OperationsList} from "./components/pages/operations/operations-list";
import {Layout} from "./components/layout";
import {OperationsForm} from "./components/pages/operations/operations-form";
import {Login} from "./components/pages/auth/login";
import {Register} from "./components/pages/auth/register";
import config from "./config/config";
import {TokensUtils} from "./utils/tokens-utils";
import {BaseCategories} from "./components/pages/base-categories/base-categories";
import {BaseCategoriesCreate} from "./components/pages/base-categories/base-categories-create";
import {BaseCategoriesEdit} from "./components/pages/base-categories/base-categories-edit";
import type {RoutesType} from "./types/routes.type";
import {OperationTypeEnum} from "./types/operation-type.enum";

const {routes} = config;

export class Router {
    titlePageElement: HTMLElement | null = null;
    contentApp: HTMLElement | null = null;
    contentMain: HTMLElement | null = null;
    routes: RoutesType[] = [];

    constructor() {
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
                load: (): void => {
                    new Dashboard()
                },
            },
            {
                route: routes.login,
                title: 'Sign In',
                filePathTemplate: '/templates/pages/auth/login.html',
                load: (): void => {
                    new Login(this.openNewRoute)
                },
            },
            {
                route: routes.register,
                title: 'Sign Up',
                filePathTemplate: '/templates/pages/auth/register.html',
                load: (): void => {
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
                load: (): void => {
                    new OperationsList(this.openNewRoute)
                },
            },
            {
                route: routes.operations.create,
                title: 'Create Operation',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new OperationsForm(this.openNewRoute)
                },
            },
            {
                route: routes.operations.edit,
                title: 'Edit Operation',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new OperationsForm(this.openNewRoute)
                },
            },
            {
                route: routes.categories.income.list,
                title: 'Income Categories',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new BaseCategories(this.openNewRoute, OperationTypeEnum.INCOME)
                },
            },
            {
                route: routes.categories.income.create,
                title: 'Create Income',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new BaseCategoriesCreate(this.openNewRoute, OperationTypeEnum.INCOME)
                },
            },
            {
                route: routes.categories.income.edit,
                title: 'Edit Income',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new BaseCategoriesEdit(this.openNewRoute, OperationTypeEnum.INCOME)
                },
            },
            {
                route: routes.categories.expense.list,
                title: 'Expense Categories',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new BaseCategories(this.openNewRoute, OperationTypeEnum.EXPENSE)
                },
            },
            {
                route: routes.categories.expense.create,
                title: 'Create Expense',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new BaseCategoriesCreate(this.openNewRoute, OperationTypeEnum.EXPENSE)
                },
            },
            {
                route: routes.categories.expense.edit,
                title: 'Edit Expense',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new BaseCategoriesEdit(this.openNewRoute, OperationTypeEnum.EXPENSE)
                },
            },
        ];
    }

    private initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    private async openNewRoute(url: string): Promise<void> {
        history.pushState({}, '', url);
        await this.activateRoute()
    };

    private async clickHandler(e: MouseEvent): Promise<void> {
        const target = e.target! as HTMLElement;

        let element: HTMLAnchorElement | null = null;
        if (target.nodeName === 'A') {
            element = target as HTMLAnchorElement;
        } else if (target.parentNode?.nodeName === "A") {
            element = target.parentNode as HTMLAnchorElement;
        }

        if (element) {
            e.preventDefault();

            const url = element.href.replace(window.location.origin, '');

            if (element.hostname !== window.location.hostname) {
                window.open(element.href, '_blank');
                return;
            }
            if (!url || (location.pathname === url.replace('#', ''))
                || url.startsWith('javascript:void(0)')) return;

            await this.openNewRoute(url);
        }
    }

    private async activateRoute(): Promise<void> {
        const urlRoute = location.pathname;
        const newRoute: RoutesType | undefined = this.routes.find((route) => route.route === urlRoute);

        if (!newRoute) {
            return await this.openNewRoute(routes.notFound)
        }
        const refreshToken = TokensUtils.getAuthInfo(TokensUtils.refreshTokenKey);
        if (newRoute.useLayout && !refreshToken) return await this.openNewRoute('/login')
        if (!newRoute.useLayout) {
            this.contentMain = null;
            if (refreshToken && newRoute.route !== routes.notFound) return await this.openNewRoute('/')
        }

        if (newRoute.title && this.titlePageElement) {
            this.titlePageElement.textContent = newRoute.title + ' | Lumincoin Finance';
        }

        if (newRoute.useLayout) {
            if (!this.contentMain && this.contentApp) {
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

        const container = this.contentMain || this.contentApp;
        if (newRoute.filePathTemplate && container) {
            container.innerHTML = await fetch(newRoute.filePathTemplate)
                .then(response => response.text());
        }

        if (newRoute.load) {
            newRoute.load();
        }
    }
}
