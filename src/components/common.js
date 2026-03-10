export class Common {
    static initCategoryLayout() {
        const button = document.getElementById("category-button");
        if ( !button ) return false;

        const wrapper = button.closest('.category-toggle-wrapper');
        const collapseElement = document.getElementById('category-collapse');
        if ( !wrapper || !collapseElement ) return false;

        if ( button.dataset.inited === '1' ) return ;
        button.dataset.inited = '1';

        collapseElement.addEventListener('show.bs.collapse', () => {
            wrapper.classList.add('active')
        });

        collapseElement.addEventListener('hide.bs.collapse', () => {
            wrapper.classList.remove('active')
        })
    }

    // static getBalance() {
    //     const balanceAmount = document.getElementById('balance-amount');
    //     if ( !balanceAmount ) return false;
    // }

    // static initLinks(openNewRoute) {
    //     this.openNewRoute = openNewRoute;
    // }
}
