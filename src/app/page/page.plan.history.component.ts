import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {HistoryModel} from '../model/history.model';
import {SettingService} from '../core/setting.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';
import {Component, OnDestroy, OnInit} from '@angular/core';


@Component({
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <app-page-title-component title="{{ languageCode | i18nSelect:menuMap.planHistory }}" topImage=false></app-page-title-component>
        </div>
        <div class="col mt-3" style="text-align: right" *ngIf="enableFormCurrent$|async">
          <button type="button" class="btn btn-rounded theme-gray waves-light" mdbWavesEffect
                  routerLink="/plan/form">{{ languageCode | i18nSelect:menuMap.application }}</button>
        </div>
      </div>
    </div>
    <ng-container *ngFor="let history of historyList">
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-sm-12">
            <a routerLink="/plan/history/{{history.key}}">
              <app-image-ratio-component image="{{ history.imgUrl }}" ratio="3:1">
              </app-image-ratio-component>
            </a>
          </div>
          <div class="col-md-4 col-sm-12">
            <h2>{{ history.getTitle(this.languageCode) }}</h2>
            <strong>{{ history.getSubTitle(this.languageCode) }}</strong>
            <div *ngFor="let text of history.getContent(this.languageCode)|stringNewLine">
              {{ text }}<br>
            </div>
          </div>
        </div>
      </div>
      <app-separate-right-component></app-separate-right-component>
    </ng-container>
  `
})
export class PagePlanHistoryComponent implements OnInit, OnDestroy {
  enableFormCurrent$: Observable<boolean>;
  historySubscription: Subscription;
  historyList: HistoryModel[];
  languageCode: string;
  langSubscription;
  menuMap;

  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.langSubscription = this.settingService.langCode$
      .subscribe(lang => {
        this.languageCode = lang;
        this.getInfo();
      });
    this.menuMap = this.settingService.menuMap;
  }
  ngOnInit() {
    this.enableFormCurrent$ = this.database.object('plan/current/enableForm').snapshotChanges()
      .pipe(map(element => {
        return element.payload.val() === true;
      }));
  }
  ngOnDestroy () {
    this.langSubscription.unsubscribe();
    this.historySubscription.unsubscribe();
  }
  getInfo() {
    if (this.historySubscription) {
      this.historySubscription.unsubscribe();
    }
    this.historySubscription = this.database
      .list('plan/history', ref => ref.orderByChild('date'))
      .snapshotChanges()
      .pipe(map(action => {
        return action.map(json => new HistoryModel(json.payload.val(), json.key));
      }))
      .subscribe(results => {
        this.historyList = results.reverse();
      });
  }
}
