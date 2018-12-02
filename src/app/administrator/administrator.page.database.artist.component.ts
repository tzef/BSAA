import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {delay, map, retry} from 'rxjs/operators';
import {ArtistModel} from '../model/artist.model';
import {Component, OnDestroy} from '@angular/core';
import {SettingService} from '../core/setting.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  template: `
    <div class="container">
      <app-page-title-component title="大藝術家" topImage=false></app-page-title-component>
      <div class="row no-gutters">
        <ng-container *ngFor="let artist of artistList">
          <div class="col-md-2 col-sm-4 col-6 mt-4">
            <div class="w-100" style="position: absolute; z-index: 1">
              <div class="float-right" (click)="this.inputImage = null; this.editingArtist = artist; form_edit.show();">
                <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
                  <i class="fa fa-edit"> </i>
                </a>
              </div>
            </div>
            <a routerLink="/administrator/database/artist/{{artist.key}}">
              <app-image-ratio-component image="{{ artist.imgUrl }}" ratio="1:1">
              </app-image-ratio-component>
            </a>
            <p style="text-align: center">{{ artist.name }}</p>
          </div>
        </ng-container>
        <div class="col-md-2 col-sm-4 col-6 mt-4">
          <div class="w-100" style="position: absolute; z-index: 1">
            <div class="float-right"
                 (click)="this.inputImage = null; this.newArtist.key = ''; this.editingArtist = newArtist; form_edit.show();">
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
            <h4 class="title" *ngIf="editingArtist.key != ''"><i class="fa fa-pencil"></i> 編輯大藝術家 </h4>
            <h4 class="title" *ngIf="editingArtist.key == ''"><i class="fa fa-pencil"></i> 新增大藝術家 </h4>
            <button id="form-edit-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_edit.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <div class="row">
                <div class="col-4 border-dark">
                  <app-image-ratio-component image="{{ editingArtist.imgUrl }}}" ratio="1:1">
                  </app-image-ratio-component>
                </div>
                <div class="col-8 md-form form-sm">
                  <input #name type="text" class="form-control"
                         placeholder="名字" value="{{ editingArtist.name }}">
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
            <button *ngIf="editingArtist.key == ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="add(name.value)">
              新增 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingArtist.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="delete(editingArtist.key)">
              刪除 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingArtist.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="update(name.value, editingArtist.key)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdministratorPageDatabaseArtistComponent implements OnDestroy {
  uploading = false;
  artistList: ArtistModel[];
  inputImage: HTMLInputElement;
  artistSubscription: Subscription;
  uploadPercent: Observable<string>;
  newArtist = new ArtistModel('', '');
  editingArtist = new ArtistModel('', '');

  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.getInfo();
  }
  ngOnDestroy () {
    if (this.artistSubscription) {
      this.artistSubscription.unsubscribe();
    }
  }
  getInfo() {
    if (this.artistSubscription) {
      this.artistSubscription.unsubscribe();
    }
    this.artistSubscription = this.database
      .list('database/artist')
      .snapshotChanges()
      .pipe(map(action => {
        return action.map(json => new ArtistModel(json.payload.val(), json.key));
      }))
      .subscribe(results => {
        this.artistList = results;
      });
  }
  add(name: string) {
    let latestKey = 0;
    for (const model of this.artistList) {
      if (Number(model.key) > latestKey) {
        latestKey = Number(model.key);
      }
    }
    if (this.inputImage) {
      this.uploading = true;
      const fileRef = 'database/artist/image_' + (latestKey + 1);
      const task = this.storage.upload(fileRef, this.inputImage);
      this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
        map((number) => {
          if (number === 100) {
            console.log(number);
            this.storage.ref(fileRef)
              .getDownloadURL()
              .pipe(delay(1000))
              .pipe(retry(2))
              .subscribe(value => {
                this.database.object('database/artist/' + (latestKey + 1))
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
      const fileRef = 'database/artist/image_' + key;
      const task = this.storage.upload(fileRef, this.inputImage);
      this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
        map((number) => {
          if (number === 100) {
            this.storage.ref(fileRef)
              .getDownloadURL()
              .pipe(delay(1000))
              .pipe(retry(2))
              .subscribe(value => {
                this.database.object('database/artist/' + key)
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
      this.database.object('database/artist/' + key)
        .update({name: name})
        .then(_ => {
          (document.getElementById('form-edit-close-btn') as HTMLElement).click();
        });
    }
  }
  delete(key: string) {
    this.storage.ref('database/artist/image_' + key).delete();
    this.database.object('database/artist/' + key).remove().then( _ => {
      (document.getElementById('form-edit-close-btn') as HTMLElement).click();
    });
  }
}
