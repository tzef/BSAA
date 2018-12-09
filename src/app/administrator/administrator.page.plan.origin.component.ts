import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {catchError, delay, map, retry} from 'rxjs/operators';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {ParagraphModel} from '../model/paragraph.model';
import {SettingService} from '../core/setting.service';
import {Observable, of, zip} from 'rxjs';
import {Router} from '@angular/router';

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
          <app-page-title-component title="{{ languageCode | i18nSelect:menuMap.planOrigin }}"></app-page-title-component>
        </div>
        <div class="col mt-3" style="text-align: right" *ngIf="enableFormCurrent$|async">
          <button type="button" class="btn btn-rounded theme-gray waves-light" mdbWavesEffect
                  routerLink="/plan/form">報名本屆炫光</button>
        </div>
      </div>
    </div>
    <ng-container *ngFor="let paragraph of paragraphList; let i = index">
      <div class="container-fluid" style="position: absolute; z-index: 1">
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
                  <app-image-ratio-component image="{{ paragraph.img }}" ratio="1:1" alt="炫光緣起 - {{ i }}">
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
                  <app-image-ratio-component image="{{ paragraph.img }}" ratio="1:1" alt="炫光緣起 - {{ i }}">
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
    <div class="container" style="position: absolute; margin-top: -55px; z-index: 1">
      <div class="row">
        <div class="col-1"></div>
        <div class="float-left"
             (click)="this.inputImage = null; newParagraph.key = ''; this.editingParagraph = newParagraph; form_paragraph.show()">
          <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
            <i class="fa fa-plus"> </i>
          </a>
        </div>
      </div>
    </div>

    <div mdbModal #form_carousel="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title"><i class="fa fa-pencil"></i> 炫光緣起輪播圖片編輯 </h4>
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

    <div mdbModal #form_paragraph="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title"><i class="fa fa-pencil"></i> 炫光緣起 內容編輯 </h4>
            <button id="form-paragraph-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
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
                  <textarea #paragraph type="text" class="md-textarea form-control" rows="2" value="{{ editingParagraph.content }}">
                  </textarea>
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
export class AdministratorPagePlanOriginComponent implements OnInit, OnDestroy {
  uploadingCarousel = false;
  carouselImageList: Observable<string[]>;
  enableFormCurrent$: Observable<boolean>;
  carouselInputImages: HTMLInputElement[] = new Array(1);
  carouselUploadPercents: Observable<string>[] = new Array(1);

  private _uploadedImgUrl: string;
  private paragraphListSubscription;
  editingParagraph = new ParagraphModel('', '');
  newParagraph = new ParagraphModel('', '');
  paragraphList: ParagraphModel[] = [];
  uploadPercent: Observable<string>;
  inputImage: HTMLInputElement;
  uploading = false;

  languageCode: string;
  langSubscription;
  menuMap;

  @Input()
  set uploadedImgUrl(url: string) {
    if (this.uploadedImgUrl !== url) {
      this._uploadedImgUrl = url;
      this.database.object('plan/origin/paragraphList/' + this.languageCode + '/' + this.editingParagraph.key)
        .update({ content: this.editingParagraph.content, img : url })
        .then(_ => {
          this.uploading = false;
          this._uploadedImgUrl = null;
          (document.getElementById('form-paragraph-close-btn') as HTMLElement).click();
        }, reason => {
          this.uploading = false;
          this._uploadedImgUrl = null;
          (document.getElementById('form-paragraph-close-btn') as HTMLElement).click();
        });
    }
  }
  get uploadedImgUrl() {
    return this._uploadedImgUrl;
  }
  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.langSubscription = this.settingService.langCode$
      .subscribe(lang => {
        this.languageCode = lang;
        if (this.paragraphListSubscription != null) {
          this.paragraphListSubscription.unsubscribe();
        }
        this.paragraphListSubscription = this.database
          .list('plan/origin/paragraphList/' + this.languageCode).snapshotChanges()
          .subscribe(results => {
            this.paragraphList = results.map(element => {
              return new ParagraphModel(element.payload.val(), element.key);
            });
          });
      });
    this.menuMap = this.settingService.menuMap;
    this.getCarouselImageList();
  }
  ngOnInit() {
    this.enableFormCurrent$ = this.database.object('plan/current/enableForm').snapshotChanges()
      .pipe(map(element => {
        return element.payload.val() === true;
      }));
  }
  ngOnDestroy() {
    this.langSubscription.unsubscribe();
    this.paragraphListSubscription.unsubscribe();
  }

  private getCarouselImageList() {
    this.carouselImageList = zip(
      this.storage.ref('plan/origin/carousel/image_0').getDownloadURL().pipe(catchError(_ => of(''))));
  }
  deleteCarouselFile(elementRef: ElementRef, index: number) {
    this.storage.ref('plan/origin/carousel/image_' + index).delete();
    this.getCarouselImageList();
  }
  uploadCarouselFile() {
    this.uploadingCarousel = true;
    const observableList$: Observable<string>[] = [];
    this.carouselInputImages.forEach((image, index) => {
      const task = this.storage.ref('plan/origin/carousel/image_' + index).put(image);
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
  deleteParagraph() {
    this.storage.ref('plan/origin/paragraphList/' + this.languageCode + '/' + 'image_' + this.editingParagraph.key).delete();
    this.database.object('plan/origin/paragraphList/' + this.languageCode + '/'
      + this.editingParagraph.key).remove().then( _ => {
      (document.getElementById('form-paragraph-close-btn') as HTMLElement).click();
    });
  }
  addParagraph(text: string) {
    if (this.inputImage) {
      this.uploading = true;
      this.database.list('plan/origin/paragraphList/' + this.languageCode)
        .push({content: text, img: 'imageUploading'})
        .then(result => {
          this.editingParagraph.content = text;
          this.editingParagraph.key = result.key;
          const fileRef = 'plan/origin/paragraphList/' + this.languageCode + '/' + 'image_' + result.key;
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
  updateParagraph(text: string) {
    if (this.inputImage) {
      this.uploading = true;
      const fileRef = 'plan/origin/paragraphList/' + this.languageCode + '/' + 'image_' + this.editingParagraph.key;
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
      this.database.object('plan/origin/paragraphList/' + this.languageCode + '/' + this.editingParagraph.key)
        .update({ content: text })
        .then(_ => {
          this.uploading = false;
          this._uploadedImgUrl = null;
          (document.getElementById('form-paragraph-close-btn') as HTMLElement).click();
        });
    }
  }
}
