import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {ParagraphModel} from '../model/paragraph.model';
import {SettingService} from '../core/setting.service';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, flatMap} from 'rxjs/operators';
import {EventModel} from '../model/event.model';
import {Observable, of, zip} from 'rxjs';

@Component({
  template: `
    <app-carousel-main-component editMode="true" [imageList]=this.carouselImageList|async></app-carousel-main-component>
    <div class="container" style="margin-top: -50px">
      <div class="row">
        <div class="col">
          <app-page-title-component title="活動預告 - {{ event.title }}"></app-page-title-component>
        </div>
        <div class="col mt-3" style="text-align: right" *ngIf="this.event.enableForm === true">
          <button type="button" class="btn btn-rounded theme-gray waves-light" mdbWavesEffect
                  routerLink="/school/calendar/form/{{event.key}}">報名活動</button>
        </div>
      </div>
    </div>
    <ng-container *ngFor="let paragraph of event.paragraphList; let i = index">
      <div class="container">
        <ng-container *ngIf="i|intIsOdd; else paragraphElseBlock">
          <div class="row">
            <div class="col-xl-2 col-lg-3 col-md-4">
              <div class="row">
                <div class="col-12">
                  <app-image-ratio-component image="{{ paragraph.img }}" ratio="1:1" alt="活動預告_{{ i }}">
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
                  <app-image-ratio-component image="{{ paragraph.img }}" ratio="1:1" alt="活動預告_{{ i }}">
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
export class PageSchoolCalendarDetailComponent implements OnInit, OnDestroy {
  private routerSubscription;
  private eventSubscription;
  private _id: string;

  event = new EventModel('', '');
  carouselImageList: Observable<string[]>;

  @Input()
  set id(id: string) {
    this._id = id;
    this.carouselImageList = zip(
      this.storage.ref('school/calendar/image_' + id).getDownloadURL().pipe(catchError(_ => of('')))
    );
    this.eventSubscription = this.database.object('school/calendar/' + id).snapshotChanges().pipe(
      flatMap(results => {
        this.event = new EventModel(results.payload.val(), results.key);
        return this.database.list('school/calendar/' + id + '/paragraphList').snapshotChanges();
      }))
      .subscribe(results => {
        results.forEach(element => {
          this.event.paragraphList.push(new ParagraphModel(element.payload.val(), element.key));
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
    this.eventSubscription.unsubscribe();
  }
}
