import * as bootstrap from 'bootstrap';

export class Layout {
    static initCategoryLayout () {
        const button = document.getElementById("category-button");
        if ( !button ) return false;

        this.categoryWrapper = button.closest('.category-toggle-wrapper');
        this.categoryCollapse = document.getElementById('category-collapse');
        if ( !this.categoryWrapper || !this.categoryCollapse ) return false;

        if ( button.dataset.inited === '1' ) return;
        button.dataset.inited = '1';

        this.collapseInstance = new bootstrap.Collapse(this.categoryCollapse, { toggle: false });

        this.categoryCollapse.addEventListener('show.bs.collapse', () => {
            this.categoryWrapper.classList.add('active')
        });

        this.categoryCollapse.addEventListener('hide.bs.collapse', () => {
            this.categoryWrapper.classList.remove('active')
        })

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

    // static getBalance() {
    //     const balanceAmount = document.getElementById('balance-amount');
    //     if ( !balanceAmount ) return false;
    // }

    // static initLinks(openNewRoute) {
    //     this.openNewRoute = openNewRoute;
    // }
}
