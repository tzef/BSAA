import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {SettingService} from '../core/setting.service';
import {HistoryModel} from '../model/history.model';
import {delay, map, retry} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <app-page-title-component title="{{ languageCode | i18nSelect:menuMap.planHistory }}" topImage=false></app-page-title-component>
        </div>
        <div class="col mt-3" style="text-align: right" *ngIf="enableFormCurrent$|async">
          <button type="button" class="btn btn-rounded theme-greenblue waves-light" mdbWavesEffect
                  routerLink="/plan/form">{{ languageCode | i18nSelect:menuMap.application }}</button>
        </div>
      </div>
    </div>
    <ng-container *ngFor="let history of historyList">
      <div class="container-fluid" style="position: absolute; z-index: 1">
        <div class="row">
          <div class="col-11">
            <div class="float-right"
                 (click)="this.inputImage = null; this.editingHistory = history; form_edit.show();">
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
            <a routerLink="/administrator/plan/history/{{history.key}}">
              <app-image-ratio-component image="{{ history.imgUrl }}" ratio="3:1">
              </app-image-ratio-component>
            </a>
          </div>
          <div class="col-md-4 col-sm-12">
            <h2>{{ history.getTitle(this.languageCode) }}</h2>
            <strong>{{ history.getSubTitle(this.languageCode) }}</strong>
            <div *ngFor="let text of history.getContent(this.languageCode)|stringNewLine">
              {{ text }}<br>
            </div>
          </div>
        </div>
      </div>
      <app-separate-right-component></app-separate-right-component>
    </ng-container>
    <div class="container" style="position: absolute; margin-top: -55px; z-index: 1">
      <div class="row">
        <div class="col-1"></div>
        <div class="float-left"
             (click)="this.inputImage = null; this.editingHistory = newHistory; form_edit.show()">
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
            <h4 class="title" *ngIf="editingHistory.key != ''"><i class="fa fa-pencil"></i> 編輯歷屆炫光 </h4>
            <h4 class="title" *ngIf="editingHistory.key == ''"><i class="fa fa-pencil"></i> 新增歷屆炫光 </h4>
            <button id="form-edit-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_edit.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <input #title type="text" class="form-control"
                     placeholder="標題" value="{{ editingHistory.getTitle(this.languageCode) }}">
            </div>
            <div class="md-form form-sm">
              <input #subTitle type="text" class="form-control"
                     placeholder="副標題" value="{{ editingHistory.getSubTitle(this.languageCode) }}">
            </div>
            <div class="md-form form-sm">
              <input #date type="date" class="form-control" placeholder="時間" value="{{ editingHistory.date }}">
            </div>
            <div class="md-form form-sm">
              <div class="row">
                <div class="col-4 border-dark">
                  <app-image-ratio-component image="{{ editingHistory.imgUrl }}}" ratio="1:1">
                  </app-image-ratio-component>
                </div>
                <div class="col-8">
                  <textarea #content mdbInputDirective type="text"
                            class="md-textarea form-control" rows="2" value="{{ editingHistory.getContent(this.languageCode) }}"></textarea>
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
            <button *ngIf="editingHistory.key == ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="add(date.value, title.value, subTitle.value, content.value)">
              新增 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingHistory.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="delete(editingHistory.key)">
              刪除 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingHistory.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="update(date.value, title.value, subTitle.value, content.value, editingHistory.key)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdministratorPagePlanHistoryComponent implements OnInit, OnDestroy {
  uploading = false;
  historyList: HistoryModel[];
  inputImage: HTMLInputElement;
  uploadPercent: Observable<string>;
  historySubscription: Subscription;
  enableFormCurrent$: Observable<boolean>;
  newHistory = new HistoryModel('', '');
  editingHistory = new HistoryModel('', '');

  languageCode: string;
  langSubscription;
  menuMap;

  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.langSubscription = this.settingService.langCode$
      .subscribe(lang => {
        this.languageCode = lang;
        this.getInfo();
      });
    this.menuMap = this.settingService.menuMap;
  }
  ngOnInit() {
    this.enableFormCurrent$ = this.database.object('plan/current/enableForm').snapshotChanges()
      .pipe(map(element => {
        return element.payload.val() === true;
      }));
  }
  ngOnDestroy () {
    this.langSubscription.unsubscribe();
    this.historySubscription.unsubscribe();
  }
  getInfo() {
    if (this.historySubscription) {
      this.historySubscription.unsubscribe();
    }
    this.historySubscription = this.database
      .list('plan/history', ref => ref.orderByChild('date'))
      .snapshotChanges()
      .pipe(map(action => {
        return action.map(json => new HistoryModel(json.payload.val(), json.key));
      }))
      .subscribe(results => {
        this.historyList = results.reverse();
      });
  }
  add(date: string, title: string, subTitle: string, content: string) {
    let latestKey = 0;
    for (const model of this.historyList) {
      if (Number(model.key) > latestKey) {
        latestKey = Number(model.key);
      }
    }
    const json = {date: date};
    if (this.languageCode === 'zh') {
      json['title_zh'] = title;
      json['content_zh'] = content;
      json['subTitle_zh'] = subTitle;
    }
    if (this.languageCode === 'en') {
      json['title_en'] = title;
      json['content_en'] = content;
      json['subTitle_en'] = subTitle;
    }
    if (this.inputImage) {
      this.uploading = true;
      const fileRef = 'plan/history/image_' + (latestKey + 1);
      const task = this.storage.upload(fileRef, this.inputImage);
      this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
        map((number) => {
          if (number === 100) {
            this.storage.ref(fileRef)
              .getDownloadURL()
              .pipe(delay(1000))
              .pipe(retry(2))
              .subscribe(value => {
                json['imgUrl'] = value;
                this.database.object('plan/history/' + (latestKey + 1))
                  .set(json)
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
    const json = {date: date};
    if (this.languageCode === 'zh') {
      json['title_zh'] = title;
      json['content_zh'] = content;
      json['subTitle_zh'] = subTitle;
    }
    if (this.languageCode === 'en') {
      json['title_en'] = title;
      json['content_en'] = content;
      json['subTitle_en'] = subTitle;
    }
    if (this.inputImage) {
      this.uploading = true;
      const fileRef = 'plan/history/image_' + key;
      const task = this.storage.upload(fileRef, this.inputImage);
      this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
        map((number) => {
          if (number === 100) {
            this.storage.ref(fileRef)
              .getDownloadURL()
              .pipe(delay(1000))
              .pipe(retry(2))
              .subscribe(value => {
                json['imgUrl'] = value;
                this.database.object('plan/history/' + key)
                  .update(json)
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
      this.database.object('plan/history/' + key)
        .update(json)
        .then(_ => {
          (document.getElementById('form-edit-close-btn') as HTMLElement).click();
        });
    }
  }
  delete(key: string) {
    this.storage.ref('plan/history/image_' + key).delete();
    this.database.object('plan/history/' + key).remove().then( _ => {
      (document.getElementById('form-edit-close-btn') as HTMLElement).click();
    });
  }
}
