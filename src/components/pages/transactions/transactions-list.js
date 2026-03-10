import { DatePicker } from "../../../utils/date-picker";
import { SelectPeriod } from "../../../utils/select-period";

export class TransactionsList {
    constructor (openNewRoute) {
        this.openNewRoute = openNewRoute;
        DatePicker.getDate('fromDate');
        DatePicker.getDate('toDate');
        new SelectPeriod();
    }
}
