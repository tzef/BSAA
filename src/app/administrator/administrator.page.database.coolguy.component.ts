import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {delay, map, retry} from 'rxjs/operators';
import {Component, OnDestroy} from '@angular/core';
import {CoolguyModel} from '../model/coolguy.model';
import {SettingService} from '../core/setting.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  template: `
    <div class="container">
      <app-page-title-component title="炫小子" topImage=false></app-page-title-component>
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
            <a routerLink="/database/coolguy/{{coolguy.key}}">
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
  `
})
export class AdministratorPageDatabaseCoolguyComponent implements OnDestroy {
  uploading = false;
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
    this.getInfo();
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
}
