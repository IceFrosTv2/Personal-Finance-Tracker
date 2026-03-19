import * as bootstrap from 'bootstrap';
import { HttpUtils } from "../utils/http-utils";
import { ToastUtils } from "../utils/toast-utils";
import { AuthService } from "../services/auth-service";
import { TokensUtils } from "../utils/tokens-utils";

export class Layout {
    static async initCategoryLayout () {
        const button = document.getElementById("category-button");
        if ( !button ) return false;

        this.categoryWrapper = button.closest('.category-toggle-wrapper');
        this.categoryCollapse = document.getElementById('category-collapse');
        if ( !this.categoryWrapper || !this.categoryCollapse ) return false;

        if ( button.dataset.inited === '1' ) return;
        button.dataset.inited = '1';

        this.initCollapse();
        this.initUserInfo();
        this.initLogout();

        await this.getBalance();
        this.updateBalance();
    }

    static initCollapse () {
        this.collapseInstance = new bootstrap.Collapse(this.categoryCollapse, { toggle: false });
        this.categoryCollapse.addEventListener('show.bs.collapse', () => {
            this.categoryWrapper.classList.add('active');
        });
        this.categoryCollapse.addEventListener('hide.bs.collapse', () => {
            this.categoryWrapper.classList.remove('active');
        });
    }

    static initUserInfo () {
        const { userInfo } = TokensUtils.getAuthInfo();
        document.getElementById('user-name').textContent = `${userInfo.name} (${userInfo.lastName})`;
    }

    static initLogout () {
        document.getElementById('logout').addEventListener('click', async () => {
            await AuthService.logout();
            location.href = "/login";
        });
    }

    static syncCategoryLayout () {
        if ( !this.categoryCollapse ) return false;
        if ( location.pathname.includes('/categories') ) {
            this.categoryWrapper.classList.add('active');
            this.collapseInstance.show();
        } else {
            this.categoryWrapper.classList.remove('active');
            this.collapseInstance.hide();
        }
    }

    static activateMenuItem (route) {
        document.querySelectorAll('.list-group-item[href]').forEach(link => {
            const href = link.getAttribute('href');
            if ( (route.route.includes(href) && href !== '/') || (route.route === href && href === '/') ) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        })
    }

    static initSidebarToggle () {
        this.contentLayout = document.querySelector('.content__layout');
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const overlay = document.querySelector('.sidebar-overlay');

        sidebarToggle.addEventListener('click', () => {
            this.contentLayout.classList.add('open');
        });

        overlay.addEventListener('click', () => {
            this.closeSidebar();
        })
    }

    static closeSidebar () {
        this.contentLayout.classList.remove('open');
    }

    static async getBalance () {
        this.balanceAmount = document.getElementById('balance-amount');
        const result = await HttpUtils.request('/balance');
        if ( ToastUtils.checkAndShowError(result) ) return false;

        this.balanceAmount.innerText = '$' + result.response.balance;
    }

    static updateBalance () {
        const labelText = document.getElementById('balance-label')
        const input = document.getElementById('balance-input');
        const closeButton = document.getElementById('button-cancel-ok');
        const updateButton = document.getElementById('button-update');
        const balanceModal = document.getElementById('updateBalance');

        balanceModal.addEventListener('show.bs.modal', () => {
            labelText.textContent = 'Enter your balance';
            input.style.display = 'block';
            updateButton.style.display = 'block';
            closeButton.textContent = 'Close';
            closeButton.className = 'btn btn-secondary';
        })

        updateButton.addEventListener('click', async () => {
            const result = await HttpUtils.request('/balance', 'PUT', true,
                { newBalance: input.value });

            if ( ToastUtils.checkAndShowError(result) ) {
                labelText.textContent = "Unable to retrieve balance";
                closeButton.className = 'btn btn-danger';
            } else {
                labelText.textContent = 'Successfully updated balance';
                input.style.display = 'none';
                updateButton.style.display = 'none';
                closeButton.textContent = 'Ok';
                closeButton.className = 'btn btn-success';
                this.balanceAmount.innerText = '$' + result.response.balance;
            }
        });
    }

}
