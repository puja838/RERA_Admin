import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit {

  isCalenderOpen = false;
  selectedMonth: any = '';
  monthNames: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedYear: any = '';
  yearList: any = [];
  @Input() dateShow = '';
  @Output() dateSelect: EventEmitter<any> = new EventEmitter();
  isSubmitted = false;
  @Input() isFormSubmitted = '';

  constructor(private common: CommonService) {
  }

  ngOnInit(): void {
    this.yearList = this.common.yearList;
    if (this.yearList.length > 0) {
      const date = new Date('1990-01-01');
      const currentDate = new Date();
      while (true) {
        this.yearList.push(date.getFullYear());
        if (date.getFullYear() === currentDate.getFullYear() + 20) {
          break;
        }
        date.setFullYear(date.getFullYear() + 1);
      }
    }
    if(this.isFormSubmitted === 'submit_true'){
      this.isSubmitted = true;
    } else {
      this.isSubmitted = false;
    }
  }

  onTextFocus(): void {
    this.isCalenderOpen = true;
  }

  onTextFocusOut(): void {
    this.isCalenderOpen = false;
  }

  onMonthClick(i: number): void {
    if (i <= 9) {
      this.selectedMonth = '0' + i;
    } else {
      this.selectedMonth = i;
    }
  }

  onYearClick(i: number): void {
    this.selectedYear = i;
  }

  saveDate() {
    if (this.selectedMonth != 0 && this.selectedYear != 0) {
      this.onTextFocusOut()
      this.dateShow = this.selectedMonth + '-' + this.selectedYear;
      this.dateSelect.emit(this.dateShow);
    }
  }


}
