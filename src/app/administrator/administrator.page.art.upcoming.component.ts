import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {delay, map, retry} from 'rxjs/operators';
import {Component, OnDestroy} from '@angular/core';
import {UpcomingModel} from '../model/upcoming.model';
import {SettingService} from '../core/setting.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <app-page-title-component title="活動預告" topImage=false></app-page-title-component>
        </div>
      </div>
    </div>
    <ng-container *ngFor="let upcoming of upcomingList">
      <div class="container-fluid" style="position: absolute">
        <div class="row">
          <div class="col-11">
            <div class="float-right" (click)="this.inputImage = null; this.editingUpcoming = upcoming; form_edit.show();">
              <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
                <i class="fa fa-edit"> </i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
          <div class="row">
            <div class="col-md-8 col-sm-12">
              <a routerLink="/administrator/art/upcoming/{{upcoming.key}}">
                <app-image-ratio-component image="{{ upcoming.imgUrl }}" ratio="3:1">
                </app-image-ratio-component>
              </a>
            </div>
            <div class="col-md-4 col-sm-12">
              <h2>{{ upcoming.title }}</h2>
              <strong>{{ upcoming.subTitle }}</strong>
              <div *ngFor="let text of upcoming.content|stringNewLine">
                {{ text }}<br>
              </div>
            </div>
          </div>
        </div>
        <app-separate-right-component></app-separate-right-component>
    </ng-container>
    <div class="container" style="position: absolute; margin-top: -55px">
      <div class="row">
        <div class="col-1"></div>
        <div class="float-left" (click)="this.inputImage = null; this.editingUpcoming = newUpcoming; form_edit.show()">
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
            <h4 class="title" *ngIf="editingUpcoming.key != ''"><i class="fa fa-pencil"></i> 編輯活動預告 </h4>
            <h4 class="title" *ngIf="editingUpcoming.key == ''"><i class="fa fa-pencil"></i> 新增活動預告 </h4>
            <button id="form-edit-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_edit.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <input #title type="text" class="form-control"
                     placeholder="標題" value="{{ editingUpcoming.title }}">
            </div>
            <div class="md-form form-sm">
              <input #subTitle type="text" class="form-control"
                     placeholder="副標題" value="{{ editingUpcoming.subTitle }}">
            </div>
            <div class="md-form form-sm">
              <input #date type="date" class="form-control" placeholder="時間" value="{{ editingUpcoming.date }}">
            </div>
            <div class="md-form form-sm">
              <div class="row">
                <div class="col-4 border-dark">
                  <app-image-ratio-component image="{{ editingUpcoming.imgUrl }}}" ratio="1:1">
                  </app-image-ratio-component>
                </div>
                <div class="col-8">
                  <textarea #content mdbInputDirective type="text"
                            class="md-textarea form-control" rows="2" value="{{ editingUpcoming.content }}"></textarea>
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
            <button *ngIf="editingUpcoming.key == ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="add(date.value, title.value, subTitle.value, content.value)">
              新增 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingUpcoming.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="delete(editingUpcoming.key)">
              刪除 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingUpcoming.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="update(date.value, title.value, subTitle.value, content.value, editingUpcoming.key)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdministratorPageArtUpcomingComponent implements OnDestroy {
  uploading = false;
  newUpcoming = new UpcomingModel('', '');
  editingUpcoming = new UpcomingModel('', '');
  upcomingSubscription: Subscription;
  upcomingList: UpcomingModel[];
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
    if (this.upcomingSubscription) {
      this.upcomingSubscription.unsubscribe();
    }
  }
  getInfo() {
    if (this.upcomingSubscription) {
      this.upcomingSubscription.unsubscribe();
    }
    this.upcomingSubscription = this.database
      .list('art/upcoming', ref => ref.orderByChild('date'))
      .snapshotChanges()
      .pipe(map(action => {
        return action.map(json => new UpcomingModel(json.payload.val(), json.key));
      }))
      .subscribe(results => {
        this.upcomingList = results.reverse();
      });
  }
  add(date: string, title: string, subTitle: string, content: string) {
    let latestKey = 0;
    for (const model of this.upcomingList) {
      if (Number(model.key) > latestKey) {
        latestKey = Number(model.key);
      }
    }
    if (this.inputImage) {
      this.uploading = true;
      const fileRef = 'art/upcoming/image_' + (latestKey + 1);
      const task = this.storage.upload(fileRef, this.inputImage);
      this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
        map((number) => {
          if (number === 100) {
            this.storage.ref(fileRef)
              .getDownloadURL()
              .pipe(delay(1000))
              .pipe(retry(2))
              .subscribe(value => {
                this.database.object('art/upcoming/' + (latestKey + 1))
                  .set({title: title, subTitle: subTitle, content: content, imgUrl: value, date: date})
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
      const fileRef = 'art/upcoming/image_' + key;
      const task = this.storage.upload(fileRef, this.inputImage);
      this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
        map((number) => {
          if (number === 100) {
            this.storage.ref(fileRef)
              .getDownloadURL()
              .pipe(delay(1000))
              .pipe(retry(2))
              .subscribe(value => {
                this.database.object('art/upcoming/' + key)
                  .update({title: title, subTitle: subTitle, content: content, imgUrl: value, date: date})
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
      this.database.object('art/upcoming/' + key)
        .update({title: title, subTitle: subTitle, content: content, date: date})
        .then(_ => {
          (document.getElementById('form-edit-close-btn') as HTMLElement).click();
        });
    }
  }
  delete(key: string) {
    this.storage.ref('art/upcoming/image_' + key).delete();
    this.database.object('art/upcoming/' + key).remove().then( _ => {
      (document.getElementById('form-edit-close-btn') as HTMLElement).click();
    });
  }
}
