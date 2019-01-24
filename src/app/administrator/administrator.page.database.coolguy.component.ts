import {Router} from '@angular/router';
import {Observable, of, Subscription, zip} from 'rxjs';
import {catchError, delay, map, retry} from 'rxjs/operators';
import {Component, ElementRef, OnDestroy} from '@angular/core';
import {CoolguyModel} from '../model/coolguy.model';
import {SettingService} from '../core/setting.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  template: `
    <div class="container-fluid" style="position: absolute; z-index: 1">
      <div class="row">
        <div class="col-11">
          <div class="float-right" (click)="form_carousel.show()">
            <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
              <i class="fa fa-edit"> </i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <app-carousel-main-component editMode="true" [imageList]=this.carouselImageList|async></app-carousel-main-component>
    <div class="container" style="margin-top: -50px">
      <div class="row">
        <div class="col">
          <app-page-title-component title="{{ languageCode | i18nSelect:menuMap.databaseCoolGuy }}"></app-page-title-component>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row no-gutters">
        <ng-container *ngFor="let coolguy of coolguyList">
          <div class="col-md-2 col-sm-4 col-6 mt-4">
            <div class="w-100" style="position: absolute; z-index: 1">
              <div class="float-right" (click)="this.inputImage = null; this.editingCoolguy = coolguy; form_edit.show();">
                <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
                  <i class="fa fa-edit"> </i>
                </a>
              </div>
            </div>
            <a routerLink="/administrator/database/coolguy/{{coolguy.key}}">
              <app-image-ratio-component image="{{ coolguy.imgUrl }}" ratio="1:1">
              </app-image-ratio-component>
            </a>
            <p style="text-align: center">{{ coolguy.name }}</p>
          </div>
        </ng-container>
        <div class="col-md-2 col-sm-4 col-6 mt-4">
          <div class="w-100" style="position: absolute; z-index: 1">
            <div class="float-right" (click)="this.inputImage = null; this.editingCoolguy = newCoolguy; form_edit.show();">
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
            <h4 class="title" *ngIf="editingCoolguy.key != ''"><i class="fa fa-pencil"></i> 編輯大藝術家 </h4>
            <h4 class="title" *ngIf="editingCoolguy.key == ''"><i class="fa fa-pencil"></i> 新增大藝術家 </h4>
            <button id="form-edit-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_edit.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <div class="row">
                <div class="col-4 border-dark">
                  <app-image-ratio-component image="{{ editingCoolguy.imgUrl }}}" ratio="1:1">
                  </app-image-ratio-component>
                </div>
                <div class="col-8 md-form form-sm">
                  <input #title type="text" class="form-control"
                         placeholder="名字" value="{{ editingCoolguy.name }}">
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
            <button *ngIf="editingCoolguy.key == ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="add(title.value)">
              新增 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingCoolguy.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="delete(editingCoolguy.key)">
              刪除 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingCoolguy.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="update(title.value, editingCoolguy.key)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div mdbModal #form_carousel="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title"><i class="fa fa-pencil"></i> 本屆炫光輪播圖片編輯 </h4>
            <button id="form-carousel-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_carousel.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm" *ngFor="let image of carouselImageList|async; let i = index">
              <i class="fa fa-picture-o"> 圖片 {{i + 1}} </i>
              <div *ngIf="image !== ''">
                <button class="btn btn-primary waves-light" mdbWavesEffect (click)="deleteCarouselFile(thumbnail, i)">
                  <i class="fa fa-trash-o mr-1"></i> Delete
                </button>
                <img #thumbnail src="{{ image }}" class="img-thumbnail">
              </div>
              <input mdbInputDirective type="file" class="form-control" (change)="this.carouselInputImages[i] = $event.target.files[0]">
              <div *ngIf="uploadingCarousel === true" style="height: 20px; background-color: burlywood"
                   [ngStyle]="{'width' : carouselUploadPercents[i] | async}">
                {{ carouselUploadPercents[i] | async }}
              </div>
            </div>
          </div>
          <div class="text-center mt-1-half">
            <button class="btn btn-info mb-2 waves-light" mdbWavesEffect (click)="uploadCarouselFile()">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdministratorPageDatabaseCoolguyComponent implements OnDestroy {
  uploadingCarousel = false;
  carouselImageList: Observable<string[]>;
  carouselInputImages: HTMLInputElement[] = new Array(1);
  carouselUploadPercents: Observable<string>[] = new Array(1);
  menuMap;
  langSubscription;
  uploading = false;
  languageCode: string;
  newCoolguy = new CoolguyModel('', '');
  editingCoolguy = new CoolguyModel('', '');
  coolguySubscription: Subscription;
  coolguyList: CoolguyModel[];
  inputImage: HTMLInputElement;
  uploadPercent: Observable<string>;
  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.menuMap = this.settingService.menuMap;
    this.langSubscription = this.settingService.langCode$
      .subscribe(lang => {
        this.languageCode = lang;
        this.getInfo();
      });
    this.getCarouselImageList();
  }
  ngOnDestroy () {
    if (this.coolguySubscription) {
      this.coolguySubscription.unsubscribe();
    }
  }
  getInfo() {
    if (this.coolguySubscription) {
      this.coolguySubscription.unsubscribe();
    }
    this.coolguySubscription = this.database
      .list('database/coolguy')
      .snapshotChanges()
      .pipe(map(action => {
        return action.map(json => new CoolguyModel(json.payload.val(), json.key));
      }))
      .subscribe(results => {
        this.coolguyList = results;
      });
  }
  add(name: string) {
    let latestKey = 0;
    for (const model of this.coolguyList) {
      if (Number(model.key) > latestKey) {
        latestKey = Number(model.key);
      }
    }
    if (this.inputImage) {
      this.uploading = true;
      const fileRef = 'database/coolguy/image_' + (latestKey + 1);
      const task = this.storage.upload(fileRef, this.inputImage);
      this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
        map((number) => {
          if (number === 100) {
            this.storage.ref(fileRef)
              .getDownloadURL()
              .pipe(delay(1000))
              .pipe(retry(2))
              .subscribe(value => {
                this.database.object('database/coolguy/' + (latestKey + 1))
                  .set({name: name, imgUrl: value})
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
  update(name: string, key: string) {
    if (this.inputImage) {
      this.uploading = true;
      const fileRef = 'database/coolguy/image_' + key;
      const task = this.storage.upload(fileRef, this.inputImage);
      this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
        map((number) => {
          if (number === 100) {
            this.storage.ref(fileRef)
              .getDownloadURL()
              .pipe(delay(1000))
              .pipe(retry(2))
              .subscribe(value => {
                this.database.object('database/coolguy/' + key)
                  .update({name: name, imgUrl: value})
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
      this.database.object('database/coolguy/' + key)
        .update({name: name})
        .then(_ => {
          (document.getElementById('form-edit-close-btn') as HTMLElement).click();
        });
    }
  }
  delete(key: string) {
    this.storage.ref('database/coolguy/image_' + key).delete();
    this.database.object('database/coolguy/' + key).remove().then( _ => {
      (document.getElementById('form-edit-close-btn') as HTMLElement).click();
    });
  }
  private getCarouselImageList() {
    this.carouselImageList = zip(
      this.storage.ref('database/coolguy/carousel/image_0').getDownloadURL().pipe(catchError(_ => of(''))));
  }
  deleteCarouselFile(elementRef: ElementRef, index: number) {
    this.storage.ref('database/coolguy/carousel/image_' + index).delete();
    this.getCarouselImageList();
  }
  uploadCarouselFile() {
    this.uploadingCarousel = true;
    const observableList$: Observable<string>[] = [];
    this.carouselInputImages.forEach((image, index) => {
      const task = this.storage.ref('database/coolguy/carousel/image_' + index).put(image);
      this.carouselUploadPercents[index] =  task.percentageChanges().pipe(
        map((number) => number + '%')
      );
      observableList$.push(this.carouselUploadPercents[index]);
    });
    zip(...observableList$)
      .subscribe(value => {
        let check = true;
        for (const element of value) {
          if (element !== '100%') {
            check = false;
          }
        }
        if (check) {
          (document.getElementById('form-carousel-close-btn') as HTMLElement).click();
          this.getCarouselImageList();
        }
      });
  }
}
