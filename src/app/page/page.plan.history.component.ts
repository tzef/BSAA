import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireStorage} from 'angularfire2/storage';
import {SettingService} from '../core/setting.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {HistoryModel} from '../model/history.model';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <app-page-title-component title="歷屆炫光" topImage=false></app-page-title-component>
        </div>
        <div class="col mt-3" style="text-align: right" *ngIf="enableFormCurrent$|async">
          <button type="button" class="btn btn-rounded theme-gray waves-light" mdbWavesEffect
                  routerLink="/plan/form">報名本屆炫光</button>
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
            <h2>{{ history.title }}</h2>
            <strong>{{ history.subTitle }}</strong>
            <div *ngFor="let text of history.content|stringNewLine">
              {{ text }}<br>
            </div>
          </div>
        </div>
      </div>
      <app-separate-right-component></app-separate-right-component>
    </ng-container>
  `
})
export class PagePlanHistoryComponent implements OnDestroy {
  historySubscription: Subscription;
  enableFormCurrent$: Observable<boolean>;
  historyList: HistoryModel[];
  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.enableFormCurrent$ = this.database.object('plan/current/enableForm').snapshotChanges()
      .pipe(map(element => {
        return element.payload.val() === true;
      }));
    this.getInfo();
  }
  ngOnDestroy () {
    if (this.historySubscription) {
      this.historySubscription.unsubscribe();
    }
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
