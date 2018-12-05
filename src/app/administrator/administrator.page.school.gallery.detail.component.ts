import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {delay, flatMap, map, retry} from 'rxjs/operators';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingService} from '../core/setting.service';
import {GalleryModel} from '../model/gallery.model';
import {ImageModel} from '../model/image.model';
import {Observable} from 'rxjs';

@Component({
  template: `
    <div class="container">
      <app-page-title-component title="歷屆花絮 - {{ gallery.title }}" topImage=false></app-page-title-component>
      <div class="row no-gutters">
        <ng-container *ngFor="let image of gallery.imgList">
          <div class="col-md-2 col-sm-4 col-6 mt-4">
            <div class="w-100" style="position: absolute; z-index: 1">
              <div class="float-right" (click)="this.inputImage = null; this.editingImg = image; form_edit.show();">
                <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
                  <i class="fa fa-edit"> </i>
                </a>
              </div>
            </div>
            <app-image-ratio-component image="{{ image.url }}" ratio="1:1">
            </app-image-ratio-component>
          </div>
        </ng-container>
        <div class="col-md-2 col-sm-4 col-6 mt-4">
          <div class="w-100" style="position: absolute; z-index: 1">
            <div class="float-right" (click)="this.inputImage = null; this.newImg.key = ''; this.editingImg = newImg; form_edit.show();">
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
    <div mdbModal #form_edit="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title" *ngIf="editingImg.key != ''"><i class="fa fa-pencil"></i> 編輯照片 </h4>
            <h4 class="title" *ngIf="editingImg.key == ''"><i class="fa fa-pencil"></i> 新增照片 </h4>
            <button id="form-img-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_edit.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <app-image-ratio-component image="{{ editingImg.url }}}" ratio="1:1">
              </app-image-ratio-component>
              <input #fileInput mdbInputDirective type="file" class="form-control" (change)="this.inputImage = $event.target.files[0]">
              <div *ngIf="uploading === true" style="height: 20px; background-color: burlywood"
                   [ngStyle]="{'width' : uploadPercent | async}">
                {{ uploadPercent | async }}
              </div>
            </div>
          </div>
          <div class="text-center mt-1-half">
            <button *ngIf="editingImg.key == ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="addImg()">
              新增 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingImg.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="deleteImg()">
              刪除 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingImg.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="updateImg()">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdministratorPageSchoolGalleryDetailComponent implements OnInit, OnDestroy {
  private _uploadedImgUrl: string;
  private gallerySubscription;
  private routerSubscription;
  private _id: string;
  uploading = false;
  inputImage: HTMLInputElement;
  uploadPercent: Observable<string>;
  gallery = new GalleryModel('', '');
  newImg = new ImageModel(0, '', '', '');
  editingImg = new ImageModel(0, '', '', '');

  @Input()
  set id(id: string) {
    this._id = id;
    this.gallerySubscription = this.database.object('school/gallery/' + id).snapshotChanges().pipe(
      flatMap(results => {
        this.gallery = new GalleryModel(results.payload.val(), results.key);
        return this.database.list('school/gallery/' + id + '/imgList').snapshotChanges();
      }))
      .subscribe(results => {
        let serialNumber = 0;
        results.forEach(element => {
          this.gallery.imgList.push(new ImageModel(serialNumber, '', element.payload.val(), element.key));
          serialNumber += 1;
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
      this.database.object('school/gallery/' + this.id + '/imgList/' + this.editingImg.key)
        .set(url)
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
              private route: ActivatedRoute) {
    this.settingService.path$.next(this.router.url);
  }

  addImg() {
    if (this.inputImage) {
      this.uploading = true;
      this.database.list('school/gallery/' + this.id + '/imgList')
        .push('imageUploading')
        .then(result => {
          this.editingImg.key = result.key;
          const fileRef = 'school/gallery/' + this.id + '/image_' + result.key;
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
  updateImg() {
    if (this.inputImage) {
      this.uploading = true;
      const fileRef = 'school/gallery/' + this.id + '/image_' + this.editingImg.key;
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
      alert('請選擇一張圖片');
    }
  }
  deleteImg() {
    this.storage.ref('school/gallery/' + this.id + '/image_' + this.editingImg.key).delete();
    this.database.object('school/gallery/' + this.id + '/imgList/' + this.editingImg.key).remove().then( _ => {
      (document.getElementById('form-img-close-btn') as HTMLElement).click();
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
    this.gallerySubscription.unsubscribe();
  }
}
