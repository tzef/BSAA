import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {SettingService} from '../core/setting.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ArtistModel} from '../model/artist.model';

@Component({
  template: `
    <div class="container" style="margin-top: 60px">
      <div class="row">
        <div class="col-xl-2 col-lg-3 col-md-4">
          <app-image-ratio-component image="{{ artist.imgUrl }}" ratio="1:1">
          </app-image-ratio-component>
          <ng-container [ngSwitch]="languageCode">
            <p *ngSwitchCase="'en'">{{ artist.en_name }}<br><span style="font-size: 14px">{{ artist.en_note }}</span></p>
            <p *ngSwitchDefault>{{ artist.zh_name }}<br><span style="font-size: 14px">{{ artist.zh_note }}</span></p>
          </ng-container>
        </div>
        <div class="col-xl-7 col-lg-6 col-md-5">
          <ng-container [ngSwitch]="languageCode">
            <ng-container *ngSwitchCase="'en'">
              <ng-container *ngFor="let text of artist.en_description|stringNewLine">
                <p>{{ text }}</p>
              </ng-container>
            </ng-container>
            <ng-container *ngSwitchDefault>
              <ng-container *ngFor="let text of artist.zh_description|stringNewLine">
                <p>{{ text }}</p>
              </ng-container>
            </ng-container>
          </ng-container>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-3">
          <div class="row no-gutters">
            <ng-container *ngFor="let img of artist.imgList; let i = index">
              <div class="col-4 mt-4" (click)="this.visible = false; this.showImage(); this.photoIndex=i; photoModal.show()">
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
        <div class="col-xl-1 col-2">
          <h1 class="float-right" (click)="previousPhoto()" *ngIf="this.photoIndex > 0">
            <i class="fa fa-chevron-left"></i>
          </h1>
        </div>
        <div class="col-xl-10 col-8"></div>
        <div class="col-xl-1 col-2">
          <h1 (click)="nextPhoto()" *ngIf="this.photoIndex < this.artist.imgList.length - 1">
            <i class="fa fa-chevron-right"></i>
          </h1>
        </div>
      </div>
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document" *ngIf="this.artist.imgList.length > 0">
        <div id="albumContainer" class="w-100 h-100" [ngClass]="visible ? 'visible' : 'invisible'" style="position:absolute">
          <img id="photoImage"
               [ngStyle]="{'width':photoOriginWidth+'px','height':photoOriginHeight+'px',
               'margin-top':photoTop+'px', 'margin-left':photoLeft+'px'}"
               style="position:relative" src="{{artist.imgList[photoIndex].url}}"/>
          <div [ngStyle]="{'width':photoOriginWidth+'px', 'margin-left':photoLeft+'px'}"
               style="position:relative; padding-left: 10px; padding-right: 10px; background-color: #000000AA">
            <ng-container [ngSwitch]="languageCode">
               <ng-container *ngSwitchCase="'en'">
                  <ng-container *ngFor="let text of artist.imgList[photoIndex].en_note|stringNewLine">
                    <p style="color: #ffffff; text-align: center">{{ text }}</p>
                  </ng-container>
               </ng-container>
               <ng-container *ngSwitchDefault>
                  <ng-container *ngFor="let text of artist.imgList[photoIndex].zh_note|stringNewLine">
                    <p style="color: #ffffff; text-align: center">{{ text }}</p>
                  </ng-container>
               </ng-container>
            </ng-container>
          </div>
        </div>
        {{getImageRatio()}}
      </div>
    </div>
  `
})
export class PageDatabaseArtistDetailComponent implements OnInit, OnDestroy {
  private routerSubscription;
  private artistSubscription;
  private _id: string;

  artist = new ArtistModel('', '');
  photoContainerWidth = 0;
  photoOriginHeight = 0;
  photoOriginWidth = 0;
  photoIndex = 0;
  photoLeft = 0;
  photoTop = 0;
  visible = false;

  languageCode: string;
  langSubscription;
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
    this.langSubscription = this.settingService.langCode$
      .subscribe(lang => {
        this.languageCode = lang;
      });
  }

  async delay(duration: number) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, duration);
    });
  }
  async showImage() {
    console.log('showImage start');
    await this.delay(300);
    this.visible = true;
    console.log('showImage end');
  }

  getImageRatio() {
    const albumHeight = (document.getElementById('albumContainer') as HTMLElement).clientHeight;
    const albumWidth = (document.getElementById('albumContainer') as HTMLElement).clientWidth;
    const photoImage = (document.getElementById('photoImage') as HTMLImageElement);
    this.photoOriginHeight = photoImage.naturalHeight;
    this.photoOriginWidth = photoImage.naturalWidth;
    this.photoContainerWidth = albumWidth;
    const ratio = this.photoOriginHeight / this.photoOriginWidth;
    if (this.photoOriginHeight > albumHeight - 100) {
      this.photoOriginHeight = (albumHeight - 100);
      this.photoOriginWidth = (albumHeight - 100) / ratio;
      this.photoLeft = (albumWidth - this.photoOriginWidth) / 2;
      this.photoTop = 0;
    } else {
      if (this.photoOriginWidth > (albumWidth - 100)) {
        this.photoOriginHeight = (albumWidth - 100) * ratio;
        this.photoOriginWidth = (albumWidth - 100);
      }
      this.photoLeft = (albumWidth - this.photoOriginWidth) / 2;
      this.photoTop = (albumHeight - this.photoOriginHeight) / 2;
    }
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
