import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {delay, map, retry} from 'rxjs/operators';
import {Component, OnDestroy} from '@angular/core';
import {UpcomingModel} from '../model/upcoming.model';
import {SettingService} from '../core/setting.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <app-page-title-component title="活動預告" topImage=false></app-page-title-component>
        </div>
      </div>
    </div>
    <ng-container *ngFor="let upcoming of upcomingList">
      <div class="container">
          <div class="row">
            <div class="col-md-8 col-sm-12">
              <a routerLink="/art/upcoming/{{upcoming.key}}">
                <app-image-ratio-component image="{{ upcoming.imgUrl }}" ratio="3:1">
                </app-image-ratio-component>
              </a>
            </div>
            <div class="col-md-4 col-sm-12">
              <h2>{{ upcoming.title }}</h2>
              <strong>{{ upcoming.subTitle }}</strong>
              <div *ngFor="let text of upcoming.content|stringNewLine">
                {{ text }}<br>
              </div>
            </div>
          </div>
        </div>
        <app-separate-right-component></app-separate-right-component>
    </ng-container>
  `
})
export class PageArtUpcomingComponent implements OnDestroy {
  upcomingSubscription: Subscription;
  upcomingList: UpcomingModel[];
  constructor(private database: AngularFireDatabase,
    private storage: AngularFireStorage,
    private settingService: SettingService,
    private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.getInfo();
  }
  ngOnDestroy () {
    if (this.upcomingSubscription) {
      this.upcomingSubscription.unsubscribe();
    }
  }
  getInfo() {
    if (this.upcomingSubscription) {
      this.upcomingSubscription.unsubscribe();
    }
    this.upcomingSubscription = this.database
      .list('art/upcoming')
      .snapshotChanges()
      .pipe(map(action => {
        return action.map(json => new UpcomingModel(json.payload.val(), json.key));
      }))
      .subscribe(results => {
        this.upcomingList = results;
      });
  }
}
