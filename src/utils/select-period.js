export class SelectPeriod {
    constructor () {
        let activePeriodButton = document.querySelector('#period .btn-secondary');
        const periods = document.getElementById('period');
        periods.addEventListener('click', (e) => {
            const button = e.target.closest("[data-period]");
            if ( !button ) return false;

            if ( button === activePeriodButton ) return false;
            activePeriodButton.classList.remove('btn-secondary');
            activePeriodButton.classList.add('btn-outline-secondary');
            button.classList.add('btn-secondary');
            button.classList.remove('btn-outline-secondary');
            activePeriodButton = button;
        })
    }
}
