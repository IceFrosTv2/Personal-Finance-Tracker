import {Collapse} from 'bootstrap';
import {HttpUtils} from "../utils/http-utils";
import {ToastUtils} from "../utils/toast-utils";
import {AuthService} from "../services/auth-service";
import {TokensUtils} from "../utils/tokens-utils";
import type {RoutesType} from "../types/routes.type";

export class Layout {
    private static categoryWrapper: HTMLElement | null = null;
    private static categoryCollapse: HTMLElement | null = null;

    private static collapseInstance: InstanceType<typeof Collapse> | null = null;

    private static contentLayout: HTMLElement | null = null;
    private static sidebarToggle: HTMLElement | null = null;
    private static overlay: HTMLElement | null = null;

    private static balanceAmount: HTMLElement | null = null;

    public static async initCategoryLayout(): Promise<void> {
        const button = document.getElementById("category-button");
        if (!button) return;

        this.categoryWrapper = button.closest('.category-toggle-wrapper') as HTMLElement;
        this.categoryCollapse = document.getElementById('category-collapse') as HTMLElement;
        if (!this.categoryWrapper || !this.categoryCollapse) return;

        this.contentLayout = document.querySelector<HTMLElement>('.content__layout');
        this.sidebarToggle = document.querySelector<HTMLElement>('.sidebar-toggle');
        this.overlay = document.querySelector<HTMLElement>('.sidebar-overlay');
        if (!this.contentLayout || !this.sidebarToggle || !this.overlay) return;

        this.balanceAmount = document.getElementById('balance-amount');
        if (!this.balanceAmount) return;

        if (button.dataset.inited === '1') return;
        button.dataset.inited = '1';

        this.initCollapse();
        this.initUserInfo();
        this.initLogout();
        this.initTheme();

        await this.getBalance();
        this.updateBalance();
    }

    private static initCollapse(): void {
        this.collapseInstance = new Collapse(this.categoryCollapse, {toggle: false});
        this.categoryCollapse!.addEventListener('show.bs.collapse', () => {
            this.categoryWrapper!.classList.add('active');
        });
        this.categoryCollapse!.addEventListener('hide.bs.collapse', () => {
            this.categoryWrapper!.classList.remove('active');
        });
    }

    private static initUserInfo(): void {
        const {userInfo} = TokensUtils.getAuthInfo();
        const userName = document.getElementById('user-name')
        if (!userName || !userInfo) return;
        userName.textContent = `${userInfo.name} ${userInfo.lastName}`;
    }

    private static initTheme(): void {
        const html = document.documentElement;
        const button = document.getElementById('theme-toggle');
        if (!button) return;

        const icon = button.querySelector('i');
        const label = button.querySelector('span');
        if (!icon || !label) return;

        if (localStorage.getItem('theme') === 'dark') {
            html.setAttribute('data-bs-theme', 'dark');
            icon.className = 'bi bi-sun me-2';
            label.textContent = 'Light theme';
        }

        button.addEventListener('click', () => {
            const isDark = html.getAttribute('data-bs-theme') === 'dark';
            if (isDark) {
                html.removeAttribute('data-bs-theme');
                icon.className = 'bi bi-moon me-2';
                label.textContent = 'Dark theme';
                localStorage.setItem('theme', 'light');
            } else {
                html.setAttribute('data-bs-theme', 'dark');
                icon.className = 'bi bi-sun me-2';
                label.textContent = 'Light theme';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    private static initLogout(): void {
        document.getElementById('logout')?.addEventListener('click', async () => {
            await AuthService.logout();
            location.href = "/login";
        });
    }

    public static syncCategoryLayout(): void {
        if (!this.categoryCollapse) return;
        if (location.pathname.includes('/categories')) {
            this.categoryWrapper!.classList.add('active');
            this.collapseInstance?.show();
        } else {
            this.categoryWrapper!.classList.remove('active');
            this.collapseInstance?.hide();
        }
    }

    public static activateMenuItem(route: RoutesType) {
        document.querySelectorAll('.list-group-item[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            if ((route.route.includes(href) && href !== '/') || (route.route === href && href === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        })
    }

    public static initSidebarToggle() {
        this.sidebarToggle!.addEventListener('click', () => {
            this.contentLayout!.classList.add('open');
        });

        this.overlay!.addEventListener('click', () => {
            this.closeSidebar();
        })
    }

    public static closeSidebar() {
        this.contentLayout!.classList.remove('open');
    }

    public static async getBalance() {
        const result = await HttpUtils.request('/balance');
        if (ToastUtils.checkAndShowError(result)) return null;

        const {balance} = result.response as { balance: number };
        this.balanceAmount!.innerText = '$' + balance;
    }

    private static updateBalance() {
        const labelText = document.getElementById('balance-label') as HTMLLabelElement;
        const input = document.getElementById('balance-input') as HTMLInputElement;
        const closeButton = document.getElementById('button-cancel-ok');
        const updateButton = document.getElementById('button-update');
        const balanceModal = document.getElementById('updateBalance');
        if (!labelText || !input || !closeButton || !updateButton || !balanceModal) return;

        balanceModal.addEventListener('show.bs.modal', () => {
            labelText.textContent = 'Enter your balance';
            input.style.display = 'block';
            updateButton.style.display = 'block';
            closeButton.textContent = 'Close';
            closeButton.className = 'btn btn-secondary';
        })

        updateButton.addEventListener('click', async () => {
            const result = await HttpUtils.request('/balance', 'PUT', true,
                {newBalance: input.value});

            if (ToastUtils.checkAndShowError(result)) {
                labelText.textContent = "Unable to retrieve balance";
                closeButton.className = 'btn btn-danger';
            } else {
                labelText.textContent = 'Successfully updated balance';
                input.style.display = 'none';
                updateButton.style.display = 'none';
                closeButton.textContent = 'Ok';
                closeButton.className = 'btn btn-success';
                const {balance} = result.response as { balance: number };
                this.balanceAmount!.innerText = '$' + balance;
            }
        });
    }

}
