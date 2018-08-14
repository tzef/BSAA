import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {ParagraphModel} from '../model/paragraph.model';
import {SettingService} from '../core/setting.service';
import {catchError} from 'rxjs/operators';
import {Observable, of, zip} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  template: `
    <app-carousel-main-component editMode="true" [imageList]=this.carouselImageList|async></app-carousel-main-component>
    <div class="container" style="margin-top: -50px">
      <div class="row">
        <div class="col">
          <app-page-title-component title="關於協會"></app-page-title-component>
        </div>
        <div class="col mt-3" style="text-align: right">
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
                  <app-image-ratio-component image="{{ paragraph.img }}" ratio="1:1" alt="關於協會 - {{ i }}">
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
                  <app-image-ratio-component image="{{ paragraph.img }}" ratio="1:1" alt="關於協會 - {{ i }}">
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
    <div class="container">
      <div *ngIf="embedVideoUrl" class="embed-responsive embed-responsive-16by9">
        <iframe class="embed-responsive-item" [src]="embedVideoUrl" allowfullscreen>
        </iframe>
      </div>
    </div>
  `
})
export class PageAboutComponent implements OnInit, OnDestroy {
  carouselImageList: Observable<string[]>;
  paragraphList: ParagraphModel[] = [];
  paragraphListSubscription;
  embedVideoUrlSubscription;
  embedVideoUrlString = '';
  embedVideoUrl: SafeUrl;

  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router, private sanitizer: DomSanitizer) {
    this.settingService.path$.next(this.router.url);
    this.getCarouselImageList();
  }
  ngOnInit() {
    this.paragraphListSubscription = this.database.list('about/paragraphList').snapshotChanges()
      .subscribe(results => {
        this.paragraphList = results.map(element => {
          return new ParagraphModel(element.payload.val(), element.key);
        });
      });
    this.embedVideoUrlSubscription = this.database.object('about/embedVideoUrl').snapshotChanges()
      .subscribe(results => {
        this.embedVideoUrlString = String(results.payload.val());
        if (this.embedVideoUrlString !== '' && this.embedVideoUrlString !== 'null') {
          this.embedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedVideoUrlString);
        } else {
          this.embedVideoUrl = null;
        }
      });
  }
  ngOnDestroy() {
    this.paragraphListSubscription.unsubscribe();
    this.embedVideoUrlSubscription.unsubscribe();
  }

  private getCarouselImageList() {
    this.carouselImageList = zip(
      this.storage.ref('about/carousel/image_0').getDownloadURL().pipe(catchError(_ => of(''))),
      this.storage.ref('about/carousel/image_1').getDownloadURL().pipe(catchError(_ => of(''))),
      this.storage.ref('about/carousel/image_2').getDownloadURL().pipe(catchError(_ => of(''))),
      this.storage.ref('about/carousel/image_3').getDownloadURL().pipe(catchError(_ => of(''))));
  }
}
