import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {SettingService} from '../core/setting.service';
import {GalleryModel} from '../model/gallery.model';
import {Component, OnDestroy} from '@angular/core';
import {delay, map, retry} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';

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
              <div class="float-right" (click)="this.inputImage = null; this.editingGallery = gallery; form_edit.show();">
                <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
                  <i class="fa fa-edit"></i>
                </a>
              </div>
            </div>
            <div *ngIf="galleryList[i + 1]" class="col-6">
              <div class="float-right" (click)="this.inputImage = null; this.editingGallery = galleryList[i + 1]; form_edit.show();">
                <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
                  <i class="fa fa-edit"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="row">
                <div class="col-md-6">
                  <a routerLink="/administrator/school/gallery/{{gallery.key}}">
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
                  <a routerLink="/administrator/school/gallery/{{galleryList[i + 1].key}}">
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
    <div class="container" style="position: absolute; margin-top: -55px; z-index: 1">
      <div class="row">
        <div class="col-1"></div>
        <div class="float-left" (click)="this.inputImage = null; this.editingGallery = newGallery; form_edit.show()">
          <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
            <i class="fa fa-plus"> </i>
          </a>
        </div>
      </div>
    </div>
    <div mdbModal #form_edit="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title" *ngIf="editingGallery.key != ''"><i class="fa fa-pencil"></i> 編輯歷屆花絮 </h4>
            <h4 class="title" *ngIf="editingGallery.key == ''"><i class="fa fa-pencil"></i> 新增歷屆花絮 </h4>
            <button id="form-edit-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_edit.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <input #title type="text" class="form-control"
                     placeholder="標題" value="{{ editingGallery.title }}">
            </div>
            <div class="md-form form-sm">
              <input #subTitle type="text" class="form-control"
                     placeholder="副標題" value="{{ editingGallery.subTitle }}">
            </div>
            <div class="md-form form-sm">
              <input #date type="date" class="form-control"
                     placeholder="時間" value="{{ editingGallery.date }}">
            </div>
            <div class="md-form form-sm">
              <div class="row">
                <div class="col-4 border-dark">
                  <app-image-ratio-component image="{{ editingGallery.imgUrl }}}" ratio="1:1">
                  </app-image-ratio-component>
                </div>
                <div class="col-8">
                  <textarea #content mdbInputDirective type="text"
                            class="md-textarea form-control" rows="2" value="{{ editingGallery.content }}"></textarea>
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
            <button *ngIf="editingGallery.key == ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="add(date.value, title.value, subTitle.value, content.value)">
              新增 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingGallery.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="delete(editingGallery.key)">
              刪除 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingGallery.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="update(date.value, title.value, subTitle.value, content.value, editingGallery.key)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdministratorPageSchoolGalleryComponent implements OnDestroy {
  uploading = false;
  newGallery = new GalleryModel('', '');
  editingGallery = new GalleryModel('', '');
  gallerySubscription: Subscription;
  galleryList: GalleryModel[];
  inputImage: HTMLInputElement;
  uploadPercent: Observable<string>;
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
  add(date: string, title: string, subTitle: string, content: string) {
    let latestKey = 0;
    for (const model of this.galleryList) {
      if (Number(model.key) > latestKey) {
        latestKey = Number(model.key);
      }
    }
    if (this.inputImage) {
      this.uploading = true;
      const fileRef = 'school/gallery/image_' + (latestKey + 1);
      const task = this.storage.upload(fileRef, this.inputImage);
      this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
        map((number) => {
          if (number === 100) {
            this.storage.ref(fileRef)
              .getDownloadURL()
              .pipe(delay(1000))
              .pipe(retry(2))
              .subscribe(value => {
                this.database.object('school/gallery/' + (latestKey + 1))
                  .set({ title: title, subTitle: subTitle, content: content, imgUrl: value, date: date })
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
      alert('請選擇一張圖片');
    }
  }
  update(date: string, title: string, subTitle: string, content: string, key: string) {
    if (this.inputImage) {
      this.uploading = true;
      const fileRef = 'school/gallery/image_' + key;
      const task = this.storage.upload(fileRef, this.inputImage);
      this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
        map((number) => {
          if (number === 100) {
            this.storage.ref(fileRef)
              .getDownloadURL()
              .pipe(delay(1000))
              .pipe(retry(2))
              .subscribe(value => {
                this.database.object('school/gallery/' + key)
                  .update({ title: title, subTitle: subTitle, content: content, imgUrl: value, date: date })
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
      this.database.object('school/gallery/' + key)
        .update({ title: title, subTitle: subTitle, content: content, date: date })
        .then(_ => {
          (document.getElementById('form-edit-close-btn') as HTMLElement).click();
        });
    }
  }
  delete(key: string) {
    this.storage.ref('school/gallery/image_' + key).delete();
    this.database.object('school/gallery/' + key).remove().then( _ => {
      (document.getElementById('form-edit-close-btn') as HTMLElement).click();
    });
  }
}
