import {Observable, of, zip} from 'rxjs';
import {catchError, flatMap} from 'rxjs/operators';
import {UpcomingModel} from '../model/upcoming.model';
import {SettingService} from '../core/setting.service';
import {ParagraphModel} from '../model/paragraph.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';

@Component({
  template: `
    <app-carousel-main-component editMode="true" [imageList]=this.carouselImageList|async></app-carousel-main-component>
    <div class="container" style="margin-top: -50px">
      <app-page-title-component title="活動預告 - {{ upcoming.title }}"></app-page-title-component>
    </div>
    <ng-container *ngFor="let paragraph of upcoming.paragraphList; let i = index">
      <div class="container">
        <ng-container *ngIf="i|intIsOdd; else paragraphElseBlock">
          <div class="row">
            <div class="col-xl-2 col-lg-3 col-md-4">
              <div class="row">
                <div class="col-12">
                  <app-image-ratio-component image="{{ paragraph.img }}" ratio="1:1" alt="活動預告 - {{ upcoming.title }}">
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
                  <app-image-ratio-component image="{{ paragraph.img }}" ratio="1:1" alt="活動預告 - {{ upcoming.title }}">
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
export class PageArtUpcomingDetailComponent implements OnInit, OnDestroy {
  private upcomingSubscription;
  private routerSubscription;
  private _id: string;

  upcoming = new UpcomingModel('', '');
  carouselImageList: Observable<string[]>;

  @Input()
  set id(id: string) {
    this._id = id;
    this.carouselImageList = zip(
      this.storage.ref('art/upcoming/image_' + id).getDownloadURL().pipe(catchError(_ => of('')))
    );
    this.upcomingSubscription = this.database.object('art/upcoming/' + id).snapshotChanges().pipe(
      flatMap(results => {
        this.upcoming = new UpcomingModel(results.payload.val(), results.key);
        return this.database.list('art/upcoming/' + id + '/paragraphList').snapshotChanges();
      }))
      .subscribe(results => {
        results.forEach(element => {
          this.upcoming.paragraphList.push(new ParagraphModel(element.payload.val(), element.key));
        });
      });
  }
  get id() {
    return this._id;
  }

  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router,
              private route: ActivatedRoute) {
    this.settingService.path$.next(this.router.url);
  }
  ngOnInit() {
    this.routerSubscription = this.route
      .params
      .subscribe(param => {
        this.id = String(+param['id']);
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.upcomingSubscription.unsubscribe();
  }
}
