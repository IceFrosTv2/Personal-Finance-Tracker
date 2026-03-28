import { SelectPeriod } from "../../utils/select-period";
import { DatePicker } from "../../utils/date-picker";

export class BaseFiltersPage {
    protected dateFrom: Date | null = null;
    protected dateTo: Date | null = null;
    protected intervalButton: HTMLButtonElement | null = null;
    protected period = 'today';

    public initPeriodFilter(onLoad: () => Promise<void>) {

        const selectPeriod = new SelectPeriod(async (dateFrom, dateTo, period) => {
            this.dateFrom = dateFrom;
            this.dateTo = dateTo;
            this.period = period;
            await onLoad();
        });

        this.intervalButton = document.querySelector('[data-period="interval"]') as HTMLButtonElement | null;

        DatePicker.getDate('fromDate', async (date) => {
            selectPeriod.setActivateButton(this.intervalButton);
            this.dateFrom = date;
            if (this.dateTo) await onLoad();
        });

        DatePicker.getDate('toDate', async (date) => {
            selectPeriod.setActivateButton(this.intervalButton);
            this.dateTo = date;
            if (this.dateFrom) await onLoad();
        });
    }

}
