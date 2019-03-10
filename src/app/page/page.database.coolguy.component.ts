import {Observable, of, Subscription, zip} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ArtistModel} from '../model/artist.model';
import {Component, OnDestroy} from '@angular/core';
import {SettingService} from '../core/setting.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  template: `
    <app-carousel-main-component editMode="true" [imageList]=this.carouselImageList|async></app-carousel-main-component>
    <div class="container" style="margin-top: -50px">
      <div class="row">
        <div class="col">
          <app-page-title-component title="{{ languageCode | i18nSelect:menuMap.databaseCoolGuy }}"></app-page-title-component>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row no-gutters">
        <ng-container *ngFor="let coolguy of coolguyList">
          <div class="col-md-2 col-sm-4 col-6 mt-4">
            <a routerLink="/database/coolguy/{{coolguy.key}}">
              <app-image-ratio-component image="{{ coolguy.imgUrl }}" ratio="1:1">
              </app-image-ratio-component>
            </a>
            <ng-container [ngSwitch]="languageCode">
              <p *ngSwitchCase="'en'" style="text-align: center">{{ coolguy.en_name }}</p>
              <p *ngSwitchDefault style="text-align: center">{{ coolguy.zh_name }}</p>
            </ng-container>
          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class PageDatabaseCoolguyComponent implements OnDestroy {
  menuMap;
  langSubscription;
  languageCode: string;
  carouselImageList: Observable<string[]>;
  coolguySubscription: Subscription;
  coolguyList: ArtistModel[];
  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.menuMap = this.settingService.menuMap;
    this.langSubscription = this.settingService.langCode$
      .subscribe(lang => {
        this.languageCode = lang;
        this.getInfo();
      });
    this.getCarouselImageList();
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
        return action.map(json => new ArtistModel(json.payload.val(), json.key));
      }))
      .subscribe(results => {
        this.coolguyList = results;
      });
  }
  private getCarouselImageList() {
    this.carouselImageList = zip(
      this.storage.ref('database/coolguy/carousel/image_0').getDownloadURL().pipe(catchError(_ => of(''))));
  }
}
