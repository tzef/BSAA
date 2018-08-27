import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AngularFireDatabase} from 'angularfire2/database';
import {ParagraphModel} from '../model/paragraph.model';
import {AngularFireStorage} from 'angularfire2/storage';
import {SettingService} from '../core/setting.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HistoryModel} from '../model/history.model';
import {catchError, flatMap} from 'rxjs/operators';
import {Observable, of, zip} from 'rxjs';

@Component({
  template: `
    <app-carousel-main-component editMode="true" [imageList]=this.carouselImageList|async></app-carousel-main-component>
    <div class="container" style="margin-top: -50px">
      <app-page-title-component title="歷屆炫光 - {{ history.title }}"></app-page-title-component>
    </div>
    <ng-container *ngFor="let paragraph of history.paragraphList; let i = index">
      <div class="container">
        <ng-container *ngIf="i|intIsOdd; else paragraphElseBlock">
          <div class="row">
            <div class="col-xl-2 col-lg-3 col-md-4">
              <div class="row">
                <div class="col-12" (click)="this.photoImg=paragraph.img; photoModal.show()">
                  <app-image-ratio-component image="{{ paragraph.img }}" ratio="1:1" alt="歷屆炫光 - {{ history.title }}">
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
                <div class="col-12" (click)="this.photoImg=paragraph.img; photoModal.show()">
                  <app-image-ratio-component image="{{ paragraph.img }}" ratio="1:1" alt="歷屆炫光 - {{ history.title }}">
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
    <div mdbModal #photoModal="mdbModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div [ngStyle]="{'height':photoHeight}">
            <img class="photoImg" src="{{ photoImg }}"/>
          </div>
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .photoImg {
        width: 100%;
        height: 100%;
        position: absolute;
        object-fit: cover;
      }
    `
  ]
})
export class PagePlanHistoryDetailComponent implements OnInit, OnDestroy {
  private historySubscription;
  private routerSubscription;
  private _id: string;

  history = new HistoryModel('', '');
  carouselImageList: Observable<string[]>;
  embedVideoUrlSubscription;
  embedVideoUrlString = '';
  embedVideoUrl: SafeUrl;
  photoHeight = window.screen.height * 0.8 + 'px';
  photoImg: string;

  @Input()
  set id(id: string) {
    this._id = id;
    this.carouselImageList = zip(
      this.storage.ref('plan/history/image_' + id).getDownloadURL().pipe(catchError(_ => of('')))
    );
    this.historySubscription = this.database.object('plan/history/' + id).snapshotChanges().pipe(
      flatMap(results => {
        this.history = new HistoryModel(results.payload.val(), results.key);
        return this.database.list('plan/history/' + id + '/paragraphList').snapshotChanges();
      }))
      .subscribe(results => {
        results.forEach(element => {
          this.history.paragraphList.push(new ParagraphModel(element.payload.val(), element.key));
        });
      });
    this.embedVideoUrlSubscription = this.database.object('plan/history/' + this.id + '/embedVideoUrl').snapshotChanges()
      .subscribe(results => {
        this.embedVideoUrlString = String(results.payload.val());
        console.log(this.embedVideoUrlString);
        if (this.embedVideoUrlString !== '' && this.embedVideoUrlString !== 'null') {
          this.embedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedVideoUrlString);
        } else {
          this.embedVideoUrl = null;
        }
      });
  }
  get id() {
    return this._id;
  }

  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer) {
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
    this.historySubscription.unsubscribe();
    this.embedVideoUrlSubscription.unsubscribe();
  }
}
