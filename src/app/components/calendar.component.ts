import {Component} from '@angular/core';

@Component({
  selector: 'app-calendar-component',
  template: `
    <div id="cal">
      <div class="header">
        <div class="row no-gutters">
          <div class="col-1">
            <span class="left button" id="prev" (click)="this.previousMonth()"> &lang; </span>
          </div>
          <div class="col-5">
            <div class="dropdown" dropdown>
              <button dropdownToggle class="dropdown-toggle" type="button">
                {{ this.monthName }}
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="#">1</a>
                <a class="dropdown-item" href="#">2</a>
                <a class="dropdown-item" href="#">3</a>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </div>
          </div>
          <div class="col-5">
            <div class="dropdown" dropdown>
              <button dropdownToggle class="btn btn-sm btn-dark dropdown-toggle waves-light" type="button" mdbWavesEffect>
                {{ this.year }}
              </button>
              <div class="dropdown-menu dropdown-dark">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </div>
          </div>
          <div class="col-1">
            <span class="right button" id="next" (click)="this.nextMonth()"> &rang; </span>
          </div>
        </div>
      </div>
      <table id="days">
        <td>sun</td>
        <td>mon</td>
        <td>tue</td>
        <td>wed</td>
        <td>thu</td>
        <td>fri</td>
        <td>sat</td>
      </table>
      <div id="cal-frame">
        <table class="curr">
          <tbody>
            <ng-container *ngFor="let weak of calendar">
              <tr>
                <ng-container *ngFor="let day of weak">
                  <td [ngClass] = "{
                    'nil': day == '',
                    'today': day == today,
                    'selected': (day == selectedDay && this.selectedYear == this.year && this.selectedMonth == this.month)
                  }" (click)="select(day)">{{ day }}</td>
                </ng-container>
              </tr>
            </ng-container>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    #cal {
      /*-moz-box-shadow:0px 3px 3px rgba(0, 0, 0, 0.25);*/
      /*-webkit-box-shadow:0px 3px 3px rgba(0, 0, 0, 0.25);*/
      border-color: black;
      margin:50px auto;
      font: 13px/1.5 "Helvetica Neue", Helvatica, Arial, san-serif;
      display:table;
    }
    #cal .header {
      cursor:default;
      border-color: black;
      /*background: #cd310d;*/
      /*background: -moz-linear-gradient(top, #b32b0c, #cd310d);*/
      /*background: -webkit-gradient(linear, left top, left bottom, from(#b32b0c), to(#cd310d));*/
      height: 34px;
      position: relative;
      color:#fff;
      /*-webkit-border-top-left-radius: 5px;*/
      /*-webkit-border-top-right-radius: 5px;*/
      /*-moz-border-radius-topleft: 5px;*/
      /*-moz-border-radius-topright: 5px;*/
      /*border-top-left-radius: 5px;*/
      /*border-top-right-radius: 5px;*/
      font-weight:bold;
      /*text-shadow:0px -1px 0 #87260C;*/
      text-transform: uppercase;
    }
    #cal .header span {
      display:inline-block;
      line-height:34px;
    }
    #cal .header .hook {
      width: 9px;
      height: 28px;
      position: absolute;
      bottom:60%;
      border-radius:10px;
      -moz-border-radius:10px;
      -webkit-border-radius:10px;
      background:#ececec;
      background: -moz-linear-gradient(right top, #fff, #827e7d);
      background: -webkit-gradient(linear, right top, right bottom, from(#fff), to(#827e7d));
      box-shadow:0px -1px 2px rgba(0, 0, 0, 0.65 );
      -moz-box-shadow:0px -1px 2px rgba(0, 0, 0, 0.65 );
      -webkit-box-shadow:0px -1px 2px rgba(0, 0, 0, 0.65 );
    }
    .right.hook {
      right:15%;
    }
    .left.hook {
      left: 15%;
    }
    #cal .header .button {
      width:24px;
      text-align:center;
      position:absolute;
    }
    #cal .header .left.button {
      left:0;
      /*-webkit-border-top-left-radius: 5px;*/
      /*-moz-border-radius-topleft: 5px;*/
      /*border-top-left-radius: 5px;*/
      /*border-right:1px solid #ae2a0c;*/
    }
    #cal .header .right.button {
      right:0;
      top:0;
      /*border-left:1px solid #ae2a0c;*/
      /*-webkit-border-top-right-radius: 5px;*/
      /*-moz-border-radius-topright: 5px;*/
      /*border-top-right-radius: 5px;*/
    }
    #cal .header .button:hover {
      background: -moz-linear-gradient(top, #d94215, #bb330f);
      background: -webkit-gradient(linear, left top, left bottom, from(#d94215), to(#bb330f));
    }
    #cal .header .month-year {
      letter-spacing: 1px;
      width: 100%;
      text-align: center;
    }
    #cal table {
      background:#fff;
      border-collapse:collapse;
    }
    #cal td {
      color:#2b2b2b;
      width:30px;
      height:30px;
      line-height:30px;
      text-align:center;
      border:1px solid #e6e6e6;
      cursor:default;
    }
    #cal #days td {
      height:26px;
      line-height: 26px;
      text-transform:uppercase;
      font-size:90%;
      color:#9e9e9e;
    }
    #cal #days td:not(:last-child) {
      border-right:1px solid #fff;
    }
    #cal #cal-frame td.today {
      background:#ededed;
      color:#8c8c8c;
      box-shadow:1px 1px 0px #fff inset;
      -moz-box-shadow:1px 1px 0px #fff inset;
      -webkit-box-shadow:1px 1px 0px #fff inset;
    }
    #cal #cal-frame td.selected {
      color:#fff;
      text-shadow: #6C1A07 0px -1px;
      background:#CD310D;
      background: -moz-linear-gradient(top, #b32b0c, #cd310d);
      background: -webkit-gradient(linear, left top, left bottom, from(#b32b0c), to(#cd310d));
      -moz-box-shadow:0px 0px 0px;
      -webkit-box-shadow:0px 0px 0px;
    }
    #cal #cal-frame td:not(.nil):hover {
      color:#fff;
      text-shadow: #6C1A07 0px -1px;
      background:#CD310D;
      background: -moz-linear-gradient(top, #b32b0c, #cd310d);
      background: -webkit-gradient(linear, left top, left bottom, from(#b32b0c), to(#cd310d));
      -moz-box-shadow:0px 0px 0px;
      -webkit-box-shadow:0px 0px 0px;
    }
    #cal #cal-frame td span {
      font-size:80%;
      position:relative;
    }
    #cal #cal-frame td span:first-child {
      bottom:5px;
    }
    #cal #cal-frame td span:last-child {
      top:5px;
    }
    #cal #cal-frame table.curr {
      float:left;
    }
    #cal #cal-frame table.temp {
      position:absolute;
    }
  `]
})
export class CalendarComponent {
  today = -1;
  selectedDay = -1;
  selectedYear = -1;
  selectedMonth = -1;
  now = new Date();
  month = this.now.getMonth();
  year = this.now.getFullYear();
  monthName;
  calendar = [];
  months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  constructor() {
    this.createCalendar(this.year, this.month);
  }

  select(day) {
    if (this.selectedYear === this.year && this.selectedMonth === this.month && this.selectedDay === day) {
      this.selectedDay = -1;
      this.selectedYear = -1;
      this.selectedMonth = -1;
    } else {
      this.selectedDay = day;
      this.selectedYear = this.year;
      this.selectedMonth = this.month;
    }
  }
  previousMonth() {
    if (this.month === 0) {
      this.month = 11;
      this.year -= 1;
    } else {
      this.month -= 1;
    }
    this.createCalendar(this.year, this.month);
  }
  nextMonth() {
    if (this.month === 11) {
      this.month = 0;
      this.year += 1;
    } else {
      this.month += 1;
    }
    this.createCalendar(this.year, this.month);
  }
  createCalendar(year, month) {
    this.monthName = this.months[month];
    if (year === this.now.getFullYear() && month === this.now.getMonth()) {
      this.today = this.now.getDate();
    } else {
      this.today = -1;
    }
    let day = 1;
    let i;
    let j;
    let haveDays = true;
    let startDay = new Date(year, month, day).getDay();
    const daysInMonths =
      [31, (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    i = 0;
    this.calendar = [];
    while (haveDays) {
      this.calendar[i] = [];
      for (j = 0; j < 7; j++) {
        if (i === 0) {
          if (j === startDay) {
            this.calendar[i][j] = day++;
            startDay++;
          }
        } else if (day <= daysInMonths[month]) {
          this.calendar[i][j] = day++;
        } else {
          this.calendar[i][j] = '';
          haveDays = false;
        }
        if (day > daysInMonths[month]) {
          haveDays = false;
        }
      }
      i++;
    }
  }
}
