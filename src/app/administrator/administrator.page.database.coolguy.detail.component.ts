import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {SettingService} from '../core/setting.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ArtistModel} from '../model/artist.model';
import {delay, map, retry} from 'rxjs/operators';
import {ImageModel} from '../model/image.model';
import {VideoModel} from '../model/video.model';
import {Observable} from 'rxjs';

@Component({
  template: `
    <div class="container" style="margin-top: 60px">
      <div class="row">
        <div class="col-xl-2 col-lg-3 col-md-4">
          <app-image-ratio-component image="{{ artist.imgUrl }}" ratio="1:1">
          </app-image-ratio-component>
          <p>{{ artist.name }}<br><span style="font-size: 14px">{{ artist.note }}</span></p>
          <div class="float-right" (click)="this.inputImage = null; form_edit.show();">
            <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
              <i class="fa fa-edit"> </i>
            </a>
          </div>
        </div>
        <div class="col-xl-7 col-lg-6 col-md-5">
          <div class="float-right" (click)="form_content.show();">
            <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
              <i class="fa fa-edit"> </i>
            </a>
          </div>
          <ng-container *ngFor="let text of artist.description|stringNewLine">
            <p>{{ text }}</p>
          </ng-container>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-3">
          <div class="row no-gutters">
            <ng-container *ngFor="let img of artist.imgList">
              <div class="col-4 mt-4">
                <div class="w-100" style="position: absolute; z-index: 1">
                  <div class="float-right" (click)="this.inputImage = null; this.editingImg = img; form_img.show();">
                    <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
                      <i class="fa fa-edit"> </i>
                    </a>
                  </div>
                </div>
                <app-image-ratio-component image="{{ img.url }}" ratio="1:1">
                </app-image-ratio-component>
              </div>
            </ng-container>
            <div class="col-4 mt-4">
              <div class="w-100" style="position: absolute; z-index: 1">
                <div class="float-right" (click)="this.inputImage = null; this.newImg.key = ''; this.editingImg = newImg; form_img.show();">
                  <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
                    <i class="fa fa-plus"> </i>
                  </a>
                </div>
              </div>
              <app-image-ratio-component image="" ratio="1:1">
              </app-image-ratio-component>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <ng-container *ngFor="let video of this.artist.videoList">
        <div class="float-left" (click)="editingVideo=video;form_iframe.show();">
          <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
            <i class="fa fa-file-video-o"> </i>
          </a>
        </div>
        <div class="embed-responsive embed-responsive-16by9">
          <iframe class="embed-responsive-item" [src]="video.safeUrl" allowfullscreen>
          </iframe>
        </div>
      </ng-container>
      <div class="float-right" (click)="editingVideo=null;form_iframe.show();">
        <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
          <i class="fa fa-plus"> </i>
        </a>
      </div>
    </div>

    <div mdbModal #form_content="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title"><i class="fa fa-pencil"></i> {{ artist.name }} 內容編輯 </h4>
            <button id="form-content-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_content.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
                <textarea #content mdbInputDirective type="text"
                          class="md-textarea form-control" rows="10" value="{{ artist.description }}"></textarea>
            </div>
          </div>
          <div class="text-center mt-1-half">
            <button class="btn btn-info mb-2 waves-light" mdbWavesEffect (click)="updateDescription(content.value)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div mdbModal #form_iframe="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title"><i class="fa fa-pencil"></i> {{ artist.name }} 影片編輯 </h4>
            <button id="form-iframe-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_iframe.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <input #url type="text" class="form-control"
                     placeholder="嵌入連結" value="{{ editingVideo ? editingVideo.url : '' }}">
            </div>
          </div>
          <div class="text-center mt-1-half">
            <button *ngIf="this.editingVideo == null" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="addVideoUrl(url.value)">新增 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="this.editingVideo != null" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="editVideoUrl(this.editingVideo.key, url.value)">更新 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="this.editingVideo != null" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="deleteVideoUrl(this.editingVideo.key)">刪除 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div mdbModal #form_edit="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title"><i class="fa fa-pencil"></i> {{ artist.name }} 內容編輯 </h4>
            <button id="form-edit-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_edit.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <div class="row">
                <div class="col-4 border-dark">
                  <app-image-ratio-component image="{{ artist.imgUrl }}}" ratio="1:1">
                  </app-image-ratio-component>
                </div>
                <div class="col-8 md-form form-sm">
                  <input #name type="text" class="form-control"
                         placeholder="名字" value="{{ artist.name }}">
                  <input #note type="text" class="form-control"
                         placeholder="備註" value="{{ artist.note }}">
                </div>
              </div>
              <input #fileInput mdbInputDirective type="file" class="form-control" (change)="this.inputImage = $event.target.files[0]">
              <div *ngIf="uploading === true" style="height: 20px; background-color: burlywood"
                   [ngStyle]="{'width' : uploadPercent | async}">
                {{ uploadPercent | async }}
              </div>
            </div>
          </div>
          <div class="text-center mt-1-half">
            <button class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="updateArtist(name.value, note.value)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div mdbModal #form_img="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title"><i class="fa fa-pencil"></i> {{ artist.name }} 相簿編輯 </h4>
            <button id="form-img-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_img.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <app-image-ratio-component image="{{ editingImg.url }}}" ratio="1:1">
              </app-image-ratio-component>
              <input #fileInput mdbInputDirective type="file" class="form-control" (change)="this.inputImage = $event.target.files[0]">
              <textarea #fileNote type="text" class="md-textarea form-control" rows="2" value="{{ editingImg.note }}"></textarea>
              <div *ngIf="uploading === true" style="height: 20px; background-color: burlywood"
                   [ngStyle]="{'width' : uploadPercent | async}">
                {{ uploadPercent | async }}
              </div>
            </div>
          </div>
          <div class="text-center mt-1-half">
            <button *ngIf="editingImg.key == ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="addImg(fileNote.value)">
              新增 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingImg.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="deleteImg()">
              刪除 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingImg.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="updateImg(fileNote.value)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdministratorPageDatabaseCoolguyDetailComponent implements OnInit, OnDestroy {
  private _uploadedImgUrl: string;
  private routerSubscription;
  private artistSubscription;
  private _id: string;

  uploading = false;
  editingVideo: VideoModel;
  inputImage: HTMLInputElement;
  uploadPercent: Observable<string>;
  artist = new ArtistModel('', '');
  newImg = new ImageModel(0, '', '', '');
  editingImg = new ImageModel(0, '', '', '');

  @Input()
  set id(id: string) {
    this._id = id;
    this.artistSubscription = this.database.object('database/coolguy/' + id).snapshotChanges()
      .subscribe(results => {
        const json = results.payload.val();
        this.artist = new ArtistModel(json, results.key);
        this.artist.videoList.forEach( videoModel => {
          videoModel.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoModel.url);
        });
      });
  }
  get id() {
    return this._id;
  }

  @Input()
  set uploadedImgUrl(url: string) {
    if (this.uploadedImgUrl !== url) {
      this._uploadedImgUrl = url;
      this.database.object('database/coolguy/' + this.id + '/imgList/' + this.editingImg.key)
        .update({ url: url })
        .then(_ => {
          this.uploading = false;
          this._uploadedImgUrl = null;
          (document.getElementById('form-img-close-btn') as HTMLElement).click();
        }, reason => {
          this.uploading = false;
          this._uploadedImgUrl = null;
          (document.getElementById('form-img-close-btn') as HTMLElement).click();
        });
    }
  }
  get uploadedImgUrl() {
    return this._uploadedImgUrl;
  }

  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer) {
    this.settingService.path$.next(this.router.url);
  }
  updateDescription(text: string) {
    this.database.object('database/coolguy/' + this.id)
      .update({ description: text })
      .then(_ => {
        (document.getElementById('form-content-close-btn') as HTMLElement).click();
      });
  }
  updateArtist(name: string, note: string) {
    if (this.inputImage) {
      this.uploading = true;
      const fileRef = 'database/coolguy/image_' + this.id;
      const task = this.storage.upload(fileRef, this.inputImage);
      this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
        map((number) => {
          if (number === 100) {
            this.storage.ref(fileRef)
              .getDownloadURL()
              .pipe(delay(1000))
              .pipe(retry(2))
              .subscribe(value => {
                this.database.object('database/coolguy/' + this.id)
                  .update({name: name, note: note, imgUrl: value})
                  .then(_ => {
                    this.uploading = false;
                    (document.getElementById('form-edit-close-btn') as HTMLElement).click();
                  });
              });
          }
          return number + '%';
        })
      );
    } else {
      this.database.object('database/coolguy/' + this.id)
        .update({name: name, note: note})
        .then(_ => {
          (document.getElementById('form-edit-close-btn') as HTMLElement).click();
        });
    }
  }
  addImg(note: string) {
    if (this.inputImage) {
      this.uploading = true;
      this.database.list('database/coolguy/' + this.id + '/imgList')
        .push({note: note, url: 'imageUploading'})
        .then(result => {
          this.editingImg.note = note;
          this.editingImg.key = result.key;
          const fileRef = 'database/coolguy/' + this.id + '/image_' + result.key;
          const task = this.storage.upload(fileRef, this.inputImage);
          this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
            map((number) => {
              if (number === 100) {
                this.storage.ref(fileRef)
                  .getDownloadURL()
                  .pipe(delay(1000))
                  .pipe(retry(2))
                  .subscribe(value => {
                    this.uploadedImgUrl = value;
                  });
              }
              return number + '%';
            })
          );
        });
    } else {
      alert('請選擇一張圖片');
    }
  }
  updateImg(note: string) {
    if (this.inputImage) {
      this.uploading = true;
      this.editingImg.note = note;
      const fileRef = 'database/coolguy/' + this.id + '/image_' + this.editingImg.key;
      const task = this.storage.upload(fileRef, this.inputImage);
      this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
        map((number) => {
          if (number === 100) {
            this.storage.ref(fileRef)
              .getDownloadURL()
              .pipe(delay(1000))
              .pipe(retry(2))
              .subscribe(value => {
                this.uploadedImgUrl = value;
              });
          }
          return number + '%';
        })
      );
    } else {
      this.database.object('database/coolguy/' + this.id + '/imgList/' + this.editingImg.key)
        .update({ note: note })
        .then(_ => {
          this.uploading = false;
          this._uploadedImgUrl = null;
          (document.getElementById('form-img-close-btn') as HTMLElement).click();
        });
    }
  }
  deleteImg() {
    this.storage.ref('database/coolguy/' + this.id + '/image_' + this.editingImg.key).delete();
    this.database.object('database/coolguy/' + this.id + '/imgList/' + this.editingImg.key).remove().then( _ => {
      (document.getElementById('form-img-close-btn') as HTMLElement).click();
    });
  }
  addVideoUrl(url: string) {
    this.database.list('database/coolguy/' + this.id + '/videoList').push(url).then(result => {
      (document.getElementById('form-iframe-close-btn') as HTMLElement).click();
    });
  }
  editVideoUrl(key: string, url: string) {
    this.database.object('database/coolguy/' + this.id + '/videoList/' + key)
      .set(url)
      .then(result => {
        (document.getElementById('form-iframe-close-btn') as HTMLElement).click();
      });
  }
  deleteVideoUrl(key: string) {
    this.database.object('database/coolguy/' + this.id + '/videoList/' + key)
      .remove()
      .then(result => {
        (document.getElementById('form-iframe-close-btn') as HTMLElement).click();
      });
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
