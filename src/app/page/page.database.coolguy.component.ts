import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {CoolguyModel} from '../model/coolguy.model';
import {Component, OnDestroy} from '@angular/core';
import {SettingService} from '../core/setting.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  template: `
    <div class="container">
      <app-page-title-component title="炫小子" topImage=false></app-page-title-component>
      <div class="row no-gutters">
        <ng-container *ngFor="let coolguy of coolguyList">
          <div class="col-md-2 col-sm-4 col-6 mt-4">
            <a routerLink="/database/coolguy/{{coolguy.key}}">
              <app-image-ratio-component image="{{ coolguy.imgUrl }}" ratio="1:1">
              </app-image-ratio-component>
            </a>
            <p style="text-align: center">{{ coolguy.name }}</p>
          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class PageDatabaseCoolguyComponent implements OnDestroy {
  coolguySubscription: Subscription;
  coolguyList: CoolguyModel[];
  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.getInfo();
  }
  ngOnDestroy () {
    if (this.coolguySubscription) {
      this.coolguySubscription.unsubscribe();
    }
  }
  getInfo() {
    if (this.coolguySubscription) {
      this.coolguySubscription.unsubscribe();
    }
    this.coolguySubscription = this.database
      .list('database/coolguy')
      .snapshotChanges()
      .pipe(map(action => {
        return action.map(json => new CoolguyModel(json.payload.val(), json.key));
      }))
      .subscribe(results => {
        this.coolguyList = results;
      });
  }
}
