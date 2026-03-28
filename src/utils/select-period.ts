export class SelectPeriod {
    activePeriodButton: HTMLElement | null = null;

    constructor(private onPeriodChange: (dateFrom: Date | null, dateTo: Date, period: string) => void) {
        this.activePeriodButton = document.querySelector('#periods .btn-secondary');

        const periods = document.getElementById('periods');
        if (!periods) return;
        periods.addEventListener('click', (e) => {
            if (!e.target || !(e.target instanceof Element)) return;
            const button = e.target.closest("[data-period]") as HTMLElement | null;
            if (!button || button === this.activePeriodButton) return false;

            this.setActivateButton(button);
            const period = button.dataset.period;
            if (!period) return;
            const {dateFrom, dateTo} = this.calculateDates(period);
            this.onPeriodChange(dateFrom, dateTo, period);
        })
    }

    public setActivateButton(button: HTMLElement | null) {
        if (!this.activePeriodButton) return;
        this.activePeriodButton.classList.replace('btn-secondary', 'btn-outline-secondary');

        if (!button) return;
        button.classList.replace('btn-outline-secondary', 'btn-secondary');
        this.activePeriodButton = button;
    }

    private calculateDates(period: string) {
        let dateFrom: Date | null = new Date();
        const dateTo = new Date();

        switch (period) {
            case 'week':
                dateFrom.setDate(dateTo.getDate() - 7);
                break;
            case 'month':
                dateFrom.setMonth(dateTo.getMonth() - 1);
                break;
            case 'year':
                dateFrom.setFullYear(dateTo.getFullYear() - 1);
                break;
            case 'all':
                dateFrom = null;
        }
        return {dateFrom, dateTo};
    }
}
