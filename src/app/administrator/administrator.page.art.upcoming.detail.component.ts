import {Observable, of, zip} from 'rxjs';
import {UpcomingModel} from '../model/upcoming.model';
import {SettingService} from '../core/setting.service';
import {ParagraphModel} from '../model/paragraph.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {catchError, delay, flatMap, map, retry} from 'rxjs/operators';

@Component({
  template: `
    <app-carousel-main-component editMode="true" [imageList]=this.carouselImageList|async></app-carousel-main-component>
    <div class="container" style="margin-top: -50px">
      <app-page-title-component title="活動預告 - {{ upcoming.title }}"></app-page-title-component>
    </div>
    <ng-container *ngFor="let paragraph of upcoming.paragraphList; let i = index">
      <div class="container-fluid" style="position: absolute">
        <div class="row">
          <div class="col-11">
            <div class="float-right" (click)="this.inputImage = null; this.editingParagraph = paragraph; form_paragraph.show()">
              <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
                <i class="fa fa-edit"> </i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <ng-container *ngIf="i|intIsOdd; else paragraphElseBlock">
          <div class="row">
            <div class="col-xl-2 col-lg-3 col-md-4">
              <div class="row">
                <div class="col-12">
                  <app-image-ratio-component image="{{ paragraph.img }}" ratio="1:1" alt="活動預告 - {{ upcoming.title }}">
                  </app-image-ratio-component>
                </div>
                <div class="col-12">
                  <img src="/assets/line_top_s.png" style="margin-left: -7px"/>
                </div>
              </div>
            </div>
            <div class="col-xl-10 col-lg-9 col-md-8">
              <ng-container *ngFor="let text of paragraph.content|stringNewLine">
                <p>{{ text }}</p>
              </ng-container>
            </div>
          </div>
        </ng-container>
        <ng-template #paragraphElseBlock>
          <div class="row">
            <div class="col-xl-10 col-lg-9 col-md-8">
              <ng-container *ngFor="let text of paragraph.content|stringNewLine">
                <p>{{ text }}</p>
              </ng-container>
            </div>
            <div class="col-xl-2 col-lg-3 col-md-4">
              <div class="row">
                <div class="col-12">
                  <app-image-ratio-component image="{{ paragraph.img }}" ratio="1:1" alt="活動預告 - {{ upcoming.title }}">
                  </app-image-ratio-component>
                </div>
                <div class="col-12" style="text-align: right">
                  <img src="/assets/line_top_s.png" style="margin-right: -6px"/>
                </div>
              </div>
            </div>
          </div>
        </ng-template>
      </div>
      <ng-container *ngIf="i|intIsOdd; else seperateLineElseBlock">
        <app-separate-right-component></app-separate-right-component>
      </ng-container>
      <ng-template #seperateLineElseBlock>
        <app-separate-left-component></app-separate-left-component>
      </ng-template>
    </ng-container>
    <div class="container" style="position: absolute; margin-top: -55px">
      <div class="row">
        <div class="col-1"></div>
        <div class="float-left" (click)="this.inputImage = null;
            newParagraph.key = ''; this.editingParagraph = newParagraph; form_paragraph.show()">
          <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
            <i class="fa fa-plus"> </i>
          </a>
        </div>
      </div>
    </div>

    <div mdbModal #form_paragraph="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title"><i class="fa fa-pencil"></i> 活動預告 - {{ upcoming.title }} 內容編輯 </h4>
            <button id="form-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_paragraph.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <div class="row">
                <div class="col-4 border-dark">
                  <app-image-ratio-component image="{{ editingParagraph.img }}}" ratio="1:1">
                  </app-image-ratio-component>
                </div>
                <div class="col-8">
                  <textarea #paragraph type="text"
                            class="md-textarea form-control" rows="2" value="{{ editingParagraph.content }}"></textarea>
                </div>
              </div>
              <input mdbInputDirective type="file" class="form-control" (change)="this.inputImage = $event.target.files[0]">
              <div *ngIf="uploading === true" style="height: 20px; background-color: burlywood"
                   [ngStyle]="{'width' : uploadPercent | async}">
                {{ uploadPercent | async }}
              </div>
            </div>
          </div>
          <div class="text-center mt-1-half">
            <button *ngIf="editingParagraph.key == ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="addParagraph(paragraph.value)">
              新增 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingParagraph.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="deleteParagraph()">
              刪除 <i class="fa fa-save ml-1"></i>
            </button>
            <button *ngIf="editingParagraph.key != ''" class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="updateParagraph(paragraph.value)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdministratorPageArtUpcomingDetailComponent implements OnInit, OnDestroy {
  private _uploadedImgUrl: string;
  private upcomingSubscription;
  private routerSubscription;
  private _id: string;

  editingParagraph = new ParagraphModel('', '');
  newParagraph = new ParagraphModel('', '');
  upcoming = new UpcomingModel('', '');
  carouselImageList: Observable<string[]>;
  uploadPercent: Observable<string>;
  inputImage: HTMLInputElement;
  uploading = false;

  @Input()
  set id(id: string) {
    this._id = id;
    this.carouselImageList = zip(
      this.storage.ref('art/upcoming/image_' + id).getDownloadURL().pipe(catchError(_ => of('')))
    );
    this.upcomingSubscription = this.database.object('art/upcoming/' + id).snapshotChanges().pipe(
      flatMap(results => {
        this.upcoming = new UpcomingModel(results.payload.val(), results.key);
        return this.database.list('art/upcoming/' + id + '/paragraphList').snapshotChanges();
      }))
      .subscribe(results => {
        results.forEach(element => {
          this.upcoming.paragraphList.push(new ParagraphModel(element.payload.val(), element.key));
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
      this.database.object('art/upcoming/' + this.id + '/paragraphList/' + this.editingParagraph.key)
        .update({ content: this.editingParagraph.content, img : url })
        .then(_ => {
          this.uploading = false;
          this._uploadedImgUrl = null;
          (document.getElementById('form-close-btn') as HTMLElement).click();
        }, reason => {
          this.uploading = false;
          this._uploadedImgUrl = null;
          (document.getElementById('form-close-btn') as HTMLElement).click();
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
  addParagraph(text: string) {
    if (this.inputImage) {
      this.uploading = true;
      this.database.list('art/upcoming/' + this.id + '/paragraphList')
        .push({content: text, img: 'imageUploading'})
        .then(result => {
          this.editingParagraph.content = text;
          this.editingParagraph.key = result.key;
          const fileRef = 'art/upcoming/' + this.id + '/paragraphList/image_' + result.key;
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
  deleteParagraph() {
    this.storage.ref('art/upcoming/' + this.id + '/paragraphList/image_' + this.editingParagraph.key).delete();
    this.database.object('art/upcoming/' + this.id + '/paragraphList/' + this.editingParagraph.key).remove().then( _ => {
      (document.getElementById('form-close-btn') as HTMLElement).click();
    });
  }
  updateParagraph(text: string) {
    if (this.inputImage) {
      this.uploading = true;
      const fileRef = 'art/upcoming/' + this.id + '/paragraphList/image_' + this.editingParagraph.key;
      const task = this.storage.upload(fileRef, this.inputImage);
      this.editingParagraph.content = text;
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
      this.database.object('art/upcoming/' + this.id + '/paragraphList/' + this.editingParagraph.key)
        .update({ content: text})
        .then(_ => {
          this.uploading = false;
          this._uploadedImgUrl = null;
          (document.getElementById('form-close-btn') as HTMLElement).click();
        });
    }
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
    this.upcomingSubscription.unsubscribe();
  }
}
