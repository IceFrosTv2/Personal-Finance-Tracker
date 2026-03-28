import {TempusDominus} from "@eonasdan/tempus-dominus";
import {biOneIcons} from '@eonasdan/tempus-dominus/dist/plugins/bi-one'

export class DatePicker {
    private static datePickerOptions = {
        display:
            {
                icons: biOneIcons,
                toolbarPlacement: 'bottom' as const,
                buttons: {
                    today: true,
                    clear: true,
                },
                components: {
                    clock: false,
                },
            },
        localization: {
            startOfTheWeek: 1,
            dayViewHeaderFormat: {month: 'long' as const, year: 'numeric' as const},
        },
    }

    public static getDate(id: string, onChange?: (date: Date) => void): TempusDominus | undefined {
        const datePickerElement = document.getElementById(id) as HTMLInputElement | null;
        if (!datePickerElement) return;
        datePickerElement.addEventListener('change.td', (e) => {
            const event = e as CustomEvent<{date: Date}>;
            const date = event.detail.date;
            const formatedDate = date.toLocaleDateString();
            const span = datePickerElement.querySelector('span');
            if (span) {
                span.textContent = formatedDate;
            } else {
                datePickerElement.value = formatedDate;
            }
            if (onChange) onChange(date);
        })
        return new TempusDominus(datePickerElement, this.datePickerOptions);
    }
}
