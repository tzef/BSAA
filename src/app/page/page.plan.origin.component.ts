import {Router} from '@angular/router';
import {Observable, of, zip} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {SettingService} from '../core/setting.service';
import {ParagraphModel} from '../model/paragraph.model';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';
import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  template: `
    <app-carousel-main-component editMode="true" [imageList]=this.carouselImageList|async></app-carousel-main-component>
    <div class="container" style="margin-top: -50px">
      <div class="row">
        <div class="col">
          <app-page-title-component title="炫光緣起"></app-page-title-component>
        </div>
        <div class="col mt-3" style="text-align: right" *ngIf="enableFormCurrent$|async">
          <button type="button" class="btn btn-rounded theme-gray waves-light" mdbWavesEffect
                  routerLink="/plan/form">報名本屆炫光</button>
        </div>
      </div>
    </div>
    <ng-container *ngFor="let paragraph of paragraphList; let i = index">
      <div class="container">
        <ng-container *ngIf="i|intIsOdd; else paragraphElseBlock">
          <div class="row">
            <div class="col-xl-2 col-lg-3 col-md-4">
              <div class="row">
                <div class="col-12">
                  <app-image-ratio-component image="{{ paragraph.img }}" ratio="1:1" alt="炫光緣起 - {{ i }}">
                  </app-image-ratio-component>
                </div>
                <div class="col-12">
                  <img src="/assets/line_top_s.png" style="margin-left: -7px"/>
                </div>
              </div>
            </div>
            <div class="col-xl-10 col-lg-9 col-md-8">
              <ng-container *ngFor="let text of paragraph.content|stringNewLine">
                <p>{{ text }}</p>
              </ng-container>
            </div>
          </div>
        </ng-container>
        <ng-template #paragraphElseBlock>
          <div class="row">
            <div class="col-xl-10 col-lg-9 col-md-8">
              <ng-container *ngFor="let text of paragraph.content|stringNewLine">
                <p>{{ text }}</p>
              </ng-container>
            </div>
            <div class="col-xl-2 col-lg-3 col-md-4">
              <div class="row">
                <div class="col-12">
                  <app-image-ratio-component image="{{ paragraph.img }}" ratio="1:1" alt="炫光緣起 - {{ i }}">
                  </app-image-ratio-component>
                </div>
                <div class="col-12" style="text-align: right">
                  <img src="/assets/line_top_s.png" style="margin-right: -6px"/>
                </div>
              </div>
            </div>
          </div>
        </ng-template>
      </div>
      <ng-container *ngIf="i|intIsOdd; else seperateLineElseBlock">
        <app-separate-right-component></app-separate-right-component>
      </ng-container>
      <ng-template #seperateLineElseBlock>
        <app-separate-left-component></app-separate-left-component>
      </ng-template>
    </ng-container>
  `
})
export class PagePlanOriginComponent implements OnInit, OnDestroy {
  carouselImageList: Observable<string[]>;
  enableFormCurrent$: Observable<boolean>;
  paragraphList: ParagraphModel[] = [];
  paragraphListSubscription;
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
        if (this.paragraphListSubscription != null) {
          this.paragraphListSubscription.unsubscribe();
        }
        this.paragraphListSubscription = this.database
          .list('plan/origin/paragraphList/' + this.languageCode).snapshotChanges()
          .subscribe(results => {
            this.paragraphList = results.map(element => {
              return new ParagraphModel(element.payload.val(), element.key);
            });
          });
      });
    this.menuMap = this.settingService.menuMap;
    this.getCarouselImageList();
  }
  ngOnInit() {
    this.enableFormCurrent$ = this.database.object('plan/current/enableForm').snapshotChanges()
      .pipe(map(element => {
        return element.payload.val() === true;
      }));
  }
  ngOnDestroy() {
    this.langSubscription.unsubscribe();
    this.paragraphListSubscription.unsubscribe();
  }

  private getCarouselImageList() {
    this.carouselImageList = zip(
      this.storage.ref('plan/origin/carousel/image_0').getDownloadURL().pipe(catchError(_ => of(''))),
    );
  }
}
