import {AngularFireDatabase} from 'angularfire2/database';
import {delay, flatMap, map, retry} from 'rxjs/operators';
import {AngularFireStorage} from 'angularfire2/storage';
import {SettingService} from '../core/setting.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {Component, OnDestroy} from '@angular/core';
import {EventModel} from '../model/event.model';
import {Router} from '@angular/router';

@Component({
  template: `
    <div class="container mb-5">
      <app-page-title-component title="活動預告" topImage=false></app-page-title-component>
      <div class="row align-items-center">
        <div class="col-xl-5 col-lg-12">
          <input #searchField type="text" class="form-control" placeholder="搜尋活動關鍵字">
        </div>
        <div class="col-xl-7 col-lg-12">
          <div class="row align-items-center justify-content-between no-gutters">
            <div class="col-xl-auto col-lg-4 col-md-4 col-sm-4 col-5">
              <input type="date" class="form-control" [(ngModel)]="dateFrom">
            </div>
            <label class="d-inline" style="margin-top: 10px">-</label>
            <div class="col-xl-auto col-lg-4 col-md-4 col-sm-4 col-5">
              <input type="date" class="form-control" [(ngModel)]="dateTo">
            </div>
            <div class="col-xl-auto col-lg-auto col-md-auto col-sm-auto col-12">
              <button type="button" (click)="this.search(searchField.value)" class="btn btn-primary waves-light" mdbWavesEffect>
                <i class="fa fa-search"> 搜尋 </i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ng-container *ngFor="let event of eventList">
      <div class="container-fluid" style="position: absolute; z-index: 1">
        <div class="row">
          <div class="col-11">
            <div class="float-right"
                 (click)="this.inputImage = null; this.editingEvent = event; form_edit.show();">
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
            <a routerLink="/administrator/school/calendar/{{event.key}}">
              <app-image-ratio-component image="{{ event.imgUrl }}" ratio="3:1">
              </app-image-ratio-component>
            </a>
          </div>
          <div class="col-md-4 col-sm-12">
            <h2>{{ event.title }}</h2>
            <strong>{{ event.subTitle }}</strong>
            <div *ngFor="let text of event.content|stringNewLine">
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
        <div class="float-left" (click)="this.inputImage = null; this.editingEvent = newEvent; form_edit.show()">
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
            <h4 class="title" *ngIf="editingEvent.key != ''"><i class="fa fa-pencil"></i> 編輯活動預告 </h4>
            <h4 class="title" *ngIf="editingEvent.key == ''"><i class="fa fa-pencil"></i> 新增活動預告 </h4>
            <button id="form-edit-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_edit.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <input #title type="text" class="form-control"
                     placeholder="標題" value="{{ editingEvent.title }}">
            </div>
            <div class="md-form form-sm">
              <input #subTitle type="text" class="form-control"
                     placeholder="副標題" value="{{ editingEvent.subTitle }}">
            </div>
            <div class="md-form form-sm">
              <input #date type="date" class="form-control"
                     placeholder="時間" value="{{ editingEvent.date }}">
            </div>
            <div class="md-form form-sm">
              <div class="row">
                <div class="col-4 border-dark">
                  <app-image-ratio-component image="{{ editingEvent.imgUrl }}}" ratio="1:1">
                  </app-image-ratio-component>
                </div>
                <div class="col-8">
                  <textarea #content mdbInputDirective type="text"
                            class="md-textarea form-control" rows="2" value="{{ editingEvent.content }}"></textarea>
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
            <button *ngIf="editingEvent.key == ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="add(date.value, title.value, subTitle.value, content.value)">
              新增 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingEvent.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="delete(editingEvent.key)">
              刪除 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingEvent.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="update(date.value, title.value, subTitle.value, content.value, editingEvent.key)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdministratorPageSchoolCalendarComponent implements OnDestroy {
  dateTo = '';
  dateFrom = '';
  uploading = false;
  searchIngKeyword = '';
  searchKeyword$ = new Subject<string>();
  queryObservable = this.searchKeyword$.pipe(
    flatMap(keyword => {
        this.searchIngKeyword = keyword;
        if (this.dateFrom !== '' && this.dateTo !== '') {
          return this.database.list('school/calendar', ref =>
            ref.orderByChild('date').startAt(this.dateFrom).endAt(this.dateTo)).snapshotChanges();
        } else if (this.dateFrom !== '') {
          return this.database.list('school/calendar', ref =>
            ref.orderByChild('date').startAt(this.dateFrom)).snapshotChanges();
        } else if (this.dateTo !== '') {
          return this.database.list('school/calendar', ref =>
            ref.orderByChild('date').endAt(this.dateTo)).snapshotChanges();
        } else {
          return this.database.list('school/calendar', ref => ref.orderByChild('date')).snapshotChanges();
        }
      }
    ))
    .pipe(map(action => {
      return action
        .map(json => new EventModel(json.payload.val(), json.key))
        .filter(value => {
          if (this.searchIngKeyword === '') {
            return true;
          } else {
            return value.title.indexOf(this.searchIngKeyword) >= 0;
          }
        });
    }));
  newEvent = new EventModel('', '');
  editingEvent = new EventModel('', '');
  eventSubscription: Subscription;
  eventList: EventModel[];
  inputImage: HTMLInputElement;
  uploadPercent: Observable<string>;
  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.getInfo();
    this.queryObservable.subscribe(results => {
      this.eventList = results.reverse();
    });
  }
  ngOnDestroy () {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
  getInfo() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    this.eventSubscription = this.database
      .list('school/calendar', ref => ref.orderByChild('date'))
      .snapshotChanges()
      .pipe(map(action => {
        return action.map(json => new EventModel(json.payload.val(), json.key));
      }))
      .subscribe(results => {
        this.eventList = results.reverse();
      });
  }
  search(keyword: string) {
    this.searchKeyword$.next(keyword);
  }
  add(date: string, title: string, subTitle: string, content: string) {
    let latestKey = 0;
    for (const model of this.eventList) {
      if (Number(model.key) > latestKey) {
        latestKey = Number(model.key);
      }
    }
    if (this.inputImage) {
      this.uploading = true;
      const fileRef = 'school/calendar/image_' + (latestKey + 1);
      const task = this.storage.upload(fileRef, this.inputImage);
      this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
        map((number) => {
          if (number === 100) {
            this.storage.ref(fileRef)
              .getDownloadURL()
              .pipe(delay(1000))
              .pipe(retry(2))
              .subscribe(value => {
                this.database.object('school/calendar/' + (latestKey + 1))
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
      const fileRef = 'school/calendar/image_' + key;
      const task = this.storage.upload(fileRef, this.inputImage);
      this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
        map((number) => {
          if (number === 100) {
            this.storage.ref(fileRef)
              .getDownloadURL()
              .pipe(delay(1000))
              .pipe(retry(2))
              .subscribe(value => {
                this.database.object('school/calendar/' + key)
                  .update({title: title, subTitle: subTitle, content: content, imgUrl: value, date: date })
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
      this.database.object('school/calendar/' + key)
        .update({title: title, subTitle: subTitle, content: content, date: date })
        .then(_ => {
          (document.getElementById('form-edit-close-btn') as HTMLElement).click();
        });
    }
  }
  delete(key: string) {
    this.storage.ref('school/calendar/image_' + key).delete();
    this.database.object('school/calendar/' + key).remove().then( _ => {
      (document.getElementById('form-edit-close-btn') as HTMLElement).click();
    });
  }
}
