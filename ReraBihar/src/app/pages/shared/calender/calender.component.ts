import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CommonService} from "../../../services/common.service";
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {Moment} from 'moment';

export const MY_FORMATS = {
    parse: {
        dateInput: 'MM-YYYY',
    },
    display: {
        dateInput: 'MM-YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-calender',
    templateUrl: './calender.component.html',
    styleUrls: ['./calender.component.css'],
    providers: [{
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ]
})
export class CalenderComponent implements OnInit, OnChanges {

    isCalenderOpen = false;
    selectedMonth: any = '';
    monthNames: any = [{name: 'Jan', value: '01'}, {name: 'Feb', value: '02'}, {name: 'Mar', value: '03'}, {
        name: 'Apr',
        value: '04'
    }, {name: 'May', value: '05'},
        {name: 'Jun', value: '06'}, {name: 'Jul', value: '07'}, {name: 'Aug', value: '08'}, {
            name: 'Sep',
            value: '09'
        }, {name: 'Oct', value: '10'}, {name: 'Nov', value: '11'}, {name: 'Dec', value: '12'}];
    selectedYear: any = new Date().getFullYear() + '';
    yearList: any = [];
    @Input() dateShow = '';
    @Output() dateSelect: EventEmitter<any> = new EventEmitter();
    isSubmitted = false;
    @Input() isFormSubmitted = false;
    date: any = '';

    constructor(private common: CommonService) {
    }

    ngOnInit(): void {
        // this.yearList = this.common.yearList;
        /*if (this.yearList.length > 0) {
          const date = new Date('1990-01-01');
          const currentDate = new Date();
          while (true) {
            this.yearList.push(date.getFullYear());
            if (date.getFullYear() === currentDate.getFullYear() + 20) {
              break;
            }
            date.setFullYear(date.getFullYear() + 1);
          }
        }*/
        window.addEventListener('click', (e: any) => {
            if (!e.target.classList.contains('checkdate')) {
                this.isCalenderOpen = false;
            }
        });
    }

    onTextFocus(): void {
        this.isCalenderOpen = true;
    }

    onTextFocusOut(): void {
        this.isCalenderOpen = false;
    }

    onMonthClick(i: number): void {
        /*if (i <= 9) {
          this.selectedMonth = '0' + i;
        } else {
          this.selectedMonth = i;
        }*/
        this.selectedMonth = i;
        this.saveDate();
    }

    onNextYear() {
        this.selectedYear = Number(this.selectedYear) + 1;
    }

    onPrevYear() {
        if (Number(this.selectedYear) > 0) {
            this.selectedYear = Number(this.selectedYear) - 1;
        }
    }

    onYearClick(i: number): void {
        this.selectedYear = i;
    }

    saveDate() {
        if (this.selectedMonth != 0 && this.selectedYear != 0) {
            this.date = new Date(this.selectedYear + '-' + this.selectedMonth + '-01');
            this.dateShow = this.selectedMonth + '-' + this.selectedYear;
            this.dateSelect.emit(this.dateShow);
        }
    }

    ngOnChanges(changes: any) {
        if (this.dateShow && this.dateShow !== '') {
            this.selectedMonth = this.dateShow.split('-')[0];
            this.selectedYear = this.dateShow.split('-')[1];
            this.date = new Date(this.selectedYear + '-' + this.selectedMonth + '-01');
        }
    }

    chosenYearHandler(normalizedYear: Moment) {
        this.selectedYear = normalizedYear.year();
    }

    chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        this.selectedMonth = normalizedMonth.month() + 1;
        datepicker.close();
        this.saveDate();
    }

}
