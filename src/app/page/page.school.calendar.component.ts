import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {SettingService} from '../core/setting.service';
import {Component, OnDestroy} from '@angular/core';
import {EventModel} from '../model/event.model';
import {flatMap, map} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  template: `
    <div class="container mb-5">
      <app-page-title-component title="活動預告" topImage=false></app-page-title-component>
      <div class="row align-items-center">
        <div class="col-xl-5 col-lg-12">
          <input #searchField type="text" class="form-control" placeholder="搜尋活動關鍵字">
        </div>
        <div class="col-xl-7 col-lg-12">
          <div class="row align-items-center justify-content-between no-gutters">
            <div class="col-xl-auto col-lg-4 col-md-4 col-sm-4 col-5">
              <input type="date" class="form-control" [(ngModel)]="dateFrom">
            </div>
            <label class="d-inline" style="margin-top: 10px">-</label>
            <div class="col-xl-auto col-lg-4 col-md-4 col-sm-4 col-5">
              <input type="date" class="form-control" [(ngModel)]="dateTo">
            </div>
            <div class="col-xl-auto col-lg-auto col-md-auto col-sm-auto col-12">
              <button type="button" (click)="this.search(searchField.value)" class="btn theme-greenblue waves-light" mdbWavesEffect>
                <i class="fa fa-search"> 搜尋 </i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ng-container *ngFor="let event of eventList">
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-sm-12">
            <a routerLink="/school/calendar/{{event.key}}">
              <app-image-ratio-component image="{{ event.imgUrl }}" ratio="3:1">
              </app-image-ratio-component>
            </a>
          </div>
          <div class="col-md-4 col-sm-12">
            <h2>{{ event.title }}</h2>
            <strong>{{ event.subTitle }}</strong>
            <div *ngFor="let text of event.content|stringNewLine">
              {{ text }}<br>
            </div>
          </div>
        </div>
      </div>
      <app-separate-right-component></app-separate-right-component>
    </ng-container>
  `
})
export class PageSchoolCalendarComponent implements OnDestroy {
  dateTo = '';
  dateFrom = '';
  searchIngKeyword = '';
  eventList: EventModel[];
  eventSubscription: Subscription;
  searchKeyword$ = new Subject<string>();
  queryObservable = this.searchKeyword$.pipe(
    flatMap(keyword => {
        this.searchIngKeyword = keyword;
        if (this.dateFrom !== '' && this.dateTo !== '') {
          return this.database.list('school/calendar', ref =>
            ref.orderByChild('date').startAt(this.dateFrom).endAt(this.dateTo)).snapshotChanges();
        } else if (this.dateFrom !== '') {
          return this.database.list('school/calendar', ref =>
            ref.orderByChild('date').startAt(this.dateFrom)).snapshotChanges();
        } else if (this.dateTo !== '') {
          return this.database.list('school/calendar', ref =>
            ref.orderByChild('date').endAt(this.dateTo)).snapshotChanges();
        } else {
          return this.database.list('school/calendar', ref => ref.orderByChild('date')).snapshotChanges();
        }
      }
    ))
    .pipe(map(action => {
      return action
        .map(json => new EventModel(json.payload.val(), json.key))
        .filter(value => {
          if (value.key === 'form') {
            return false;
          }
          if (this.searchIngKeyword === '') {
            return true;
          } else {
            return value.title.indexOf(this.searchIngKeyword) >= 0;
          }
        });
    }));
  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.getInfo();
    this.queryObservable.subscribe(results => {
      this.eventList = results.reverse();
    });
  }
  ngOnDestroy () {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
  getInfo() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    this.eventSubscription = this.database
      .list('school/calendar', ref => ref.orderByChild('date'))
      .snapshotChanges()
      .pipe(map(action => {
        return action
          .map(json => new EventModel(json.payload.val(), json.key))
          .filter(value => {
            if (value.key === 'form') {
              return false;
            } else {
              return true;
            }
          });
      }))
      .subscribe(results => {
        this.eventList = results.reverse();
      });
  }
  search(keyword: string) {
    this.searchKeyword$.next(keyword);
  }
}
