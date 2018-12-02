import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {SettingService} from '../core/setting.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ArtistModel} from '../model/artist.model';

@Component({
  template: `
    <div class="container" style="margin-top: 60px">
      <div class="row">
        <div class="col-xl-2 col-lg-3 col-md-4">
          <app-image-ratio-component image="{{ artist.imgUrl }}" ratio="1:1">
          </app-image-ratio-component>
          <p>{{ artist.name }}<br><span style="font-size: 14px">{{ artist.note }}</span></p>
        </div>
        <div class="col-xl-7 col-lg-6 col-md-5">
          <ng-container *ngFor="let text of artist.description|stringNewLine">
            <p>{{ text }}</p>
          </ng-container>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-3">
          <div class="row no-gutters">
            <ng-container *ngFor="let img of artist.imgList; let i = index">
              <div class="col-4 mt-4" (click)="this.photoIndex=i; photoModal.show()">
                <app-image-ratio-component image="{{ img.url }}" ratio="1:1">
                </app-image-ratio-component>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <ng-container *ngFor="let video of this.artist.videoList">
        <div class="embed-responsive embed-responsive-16by9">
          <iframe class="embed-responsive-item" [src]="video.safeUrl" allowfullscreen>
          </iframe>
        </div>
      </ng-container>
    </div>

    <div mdbModal #photoModal="mdbModal" class="modal" tabindex="-1" role="dialog">
      <div class="row" style="position:relative; top: 50%">
        <div class="col-1">
          <h1 class="float-right" (click)="previousPhoto()" *ngIf="this.photoIndex > 0">
            <i class="fa fa-chevron-left"></i>
          </h1>
        </div>
        <div class="col-10"></div>
        <div class="col-1">
          <h1 (click)="nextPhoto()" *ngIf="this.photoIndex < this.artist.imgList.length - 1">
            <i class="fa fa-chevron-right"></i>
          </h1>
        </div>
      </div>
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document" *ngIf="this.artist.imgList.length > 0">
        <div class="w-100 h-100" style="position:absolute; background-color: dimgray">
          <img class="photoImg w-100" [ngStyle]="{'height' : photoHeight}" style="object-fit:contain;position:relative"
               src="{{artist.imgList[photoIndex].url}}"/>
          <div style="position:relative; padding-left: 10px; padding-right: 10px">
            <ng-container *ngFor="let text of artist.imgList[photoIndex].note|stringNewLine">
              <p style="color: #ffffff">{{ text }}</p>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PageDatabaseArtistDetailComponent implements OnInit, OnDestroy {
  private routerSubscription;
  private artistSubscription;
  private _id: string;

  photoIndex = 0;
  artist = new ArtistModel('', '');
  photoHeight = (window.screen.height * 0.8 - 100) + 'px';

  @Input()
  set id(id: string) {
    this._id = id;
    this.artistSubscription = this.database.object('database/artist/' + id).snapshotChanges()
      .subscribe(results => {
        this.artist = new ArtistModel(results.payload.val(), results.key);
        this.artist.videoList.forEach( videoModel => {
          videoModel.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoModel.url);
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
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer) {
    this.settingService.path$.next(this.router.url);
  }

  nextPhoto() {
    this.photoIndex += 1;
  }
  previousPhoto() {
    this.photoIndex -= 1;
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
    this.artistSubscription.unsubscribe();
  }
}
