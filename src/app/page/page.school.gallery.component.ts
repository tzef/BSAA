import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {SettingService} from '../core/setting.service';
import {GalleryModel} from '../model/gallery.model';
import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  template: `
    <div class="container">
      <app-page-title-component title="歷屆花絮" topImage=false></app-page-title-component>
    </div>
    <ng-container *ngFor="let gallery of galleryList; let i = index">
      <ng-container *ngIf="i % 2 === 0">
        <div class="container">
          <div class="row">
            <div class="col-6">
              <div class="row">
                <div class="col-md-6">
                  <a routerLink="/school/gallery/{{gallery.key}}">
                    <app-image-ratio-component image="{{ gallery.imgUrl }}" ratio="1:1">
                    </app-image-ratio-component>
                  </a>
                </div>
                <div class="col-md-6">
                  <h2>{{ gallery.title }}</h2>
                  <strong>{{ gallery.subTitle }}</strong>
                  <div *ngFor="let text of gallery.content|stringNewLine">
                    {{ text }}<br>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="galleryList[i + 1] != null" class="col-6">
              <div class="row">
                <div class="col-md-6">
                  <a routerLink="/school/gallery/{{galleryList[i + 1].key}}">
                    <app-image-ratio-component image="{{ galleryList[i + 1].imgUrl }}" ratio="1:1">
                    </app-image-ratio-component>
                  </a>
                </div>
                <div class="col-md-6">
                  <h2>{{ galleryList[i + 1].title }}</h2>
                  <strong>{{ galleryList[i + 1].subTitle }}</strong>
                  <div *ngFor="let text of galleryList[i + 1].content|stringNewLine">
                    {{ text }}<br>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <app-separate-right-component></app-separate-right-component>
      </ng-container>
    </ng-container>
  `
})
export class PageSchoolGalleryComponent implements OnDestroy {
  galleryList: GalleryModel[];
  gallerySubscription: Subscription;

  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.getInfo();
  }
  ngOnDestroy () {
    if (this.gallerySubscription) {
      this.gallerySubscription.unsubscribe();
    }
  }
  getInfo() {
    if (this.gallerySubscription) {
      this.gallerySubscription.unsubscribe();
    }
    this.gallerySubscription = this.database
      .list('school/gallery', ref => ref.orderByChild('date'))
      .snapshotChanges()
      .pipe(map(action => {
        return action.map(json => new GalleryModel(json.payload.val(), json.key));
      }))
      .subscribe(results => {
        this.galleryList = results.reverse();
      });
  }
}
