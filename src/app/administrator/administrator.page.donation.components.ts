import {Component, ElementRef, Input, OnDestroy} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {SettingService} from '../core/setting.service';
import {DonationModel} from '../model/donation.model';
import {catchError, delay, map, retry} from 'rxjs/operators';
import {Observable, of, zip} from 'rxjs';
import {Router} from '@angular/router';
import {ToastService} from 'ng-uikit-pro-standard';

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
    <div class="container-fluid" style="position: absolute; z-index: 1">
      <div class="row">
        <div class="col-11">
          <div class="float-right" (click)="form_desc.show()">
            <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
              <i class="fa fa-edit"> </i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <ng-container *ngFor="let text of this.donation.description|stringNewLine">
        <p>{{ text }}</p>
      </ng-container>
    </div>
    <div class="container-fluid" style="position: absolute; z-index: 1">
      <div class="row">
        <div class="col-11">
          <div class="float-right" (click)="form_plan.show()">
            <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
              <i class="fa fa-edit"> </i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col mt-3" style="z-index: 2">
          <ng-container *ngIf="this.displayPlan; else displayPlanElseBlock">
            <button type="button" class="btn btn-rounded waves-light" mdbWavesEffect
                    style="background: #55a9b7;" (click)="showPlan()">招募計畫</button>
            <button type="button" class="btn btn-rounded waves-light theme-gray" mdbWavesEffect (click)="showForm()">報名炫志工</button>
          </ng-container>
          <ng-template #displayPlanElseBlock>
            <button type="button" class="btn btn-rounded waves-light theme-gray" mdbWavesEffect (click)="showPlan()">招募計畫</button>
            <button type="button" class="btn btn-rounded waves-light" mdbWavesEffect
                    style="background: #55a9b7;" (click)="showForm()">報名炫志工</button>
          </ng-template>
        </div>
      </div>
      <div class="mt-3" style="background: #a1a1a1; padding: 24px" *ngIf="this.displayPlan">
        <ng-container *ngFor="let text of this.donation.plan|stringNewLine">
          <p style="color: white">{{ text }}</p>
        </ng-container>
        <div class="row">
          <div class="col-md-6">
            <app-image-ratio-component image="{{ this.planPhoto1Image|async }}" ratio="16:9" alt="招募計畫 - 1">
            </app-image-ratio-component>
            <p style="text-align: center; color: #fff;" class="mt-1">{{ this.donation.photo1title }}</p>
          </div>
          <div class="col-md-6">
            <app-image-ratio-component image="{{ this.planPhoto2Image|async }}" ratio="16:9" alt="招募計畫 - 2">
            </app-image-ratio-component>
            <p style="text-align: center; color: #fff;" class="mt-1">{{ this.donation.photo2title }}</p>
          </div>
        </div>
      </div>
      <div class="mt-3" style="background: #a1a1a1; padding: 24px" *ngIf="this.displayForm">
        <p style="color: white">成人志工申請表</p>
        <div class="row mt-2">
          <div class="col-md-12">
            <p style="color: white">申請人姓名</p>
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <input type="text" name="formName" placeholder="申請人姓名" class="form-control" required [(ngModel)]="formName">
                </div>
              </div>
              <div class="col-6">
                <div class="row mt-1" style="margin-left: 0px">
                  <div class="form-check">
                    <input name="groupSex" type="radio" id="radioMale" class="form-check-input" (click)="changeSex('先生')">
                    <label class="form-check-label" for="radioMale"><p style="color: white">先生</p></label>
                  </div>
                  <div class="form-check">
                    <input name="groupSex" type="radio" id="radioFemale" class="form-check-input" (click)="changeSex('小姐')">
                    <label class="form-check-label" for="radioFemale"><p style="color: white">小姐</p></label>
                  </div>
                </div>
              </div>
            </div>
            <p style="color: white"></p>
            <div class="form-group">
              <input type="date"
                     name="formBirthday"
                     class="form-control"
                     required [(ngModel)]="formBirthday">
            </div>
            <p style="color: white">住家電話</p>
            <div class="form-group">
              <input type="text"
                     name="formHomePhone"
                     class="form-control"
                     required [(ngModel)]="formHomePhone">
            </div>
            <p style="color: white">行動電話</p>
            <div class="form-group">
              <input type="text"
                     name="formCellPhone"
                     class="form-control"
                     required [(ngModel)]="formCellPhone">
            </div>
            <p style="color: white">公司電話</p>
            <div class="form-group">
              <input type="text"
                     name="formCompanyPhone"
                     class="form-control"
                     required [(ngModel)]="formCompanyPhone">
            </div>
            <p style="color: white">電子郵件</p>
            <div class="form-group">
              <input type="email"
                     name="formMail"
                     class="form-control"
                     required [(ngModel)]="formMail">
            </div>
            <p style="color: white">地址</p>
            <div class="form-group">
              <input type="text"
                     name="formAddress"
                     class="form-control"
                     required [(ngModel)]="formAddress">
            </div>
            <p style="color: white">學歷</p>
            <div class="form-group">
              <div class="row">
                <div class="form-check">
                  <input class="form-check-input" name="groupDegree"
                         type="radio" id="radioDegreeDoctor" (click)="changeDegree('博士')">
                  <label class="form-check-label" for="radioDegreeDoctor"><p style="color: white">博士</p></label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" name="groupDegree"
                         type="radio" id="radioDegreeMaster" (click)="changeDegree('碩士')">
                  <label class="form-check-label" for="radioDegreeMaster"><p style="color: white">碩士</p></label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" name="groupDegree"
                         type="radio" id="radioDegreeBachelor" (click)="changeDegree('大學')">
                  <label class="form-check-label" for="radioDegreeBachelor"><p style="color: white">大學</p></label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" name="groupDegree"
                         type="radio" id="radioDegreeVocational" (click)="changeDegree('專科')">
                  <label class="form-check-label" for="radioDegreeVocational"><p style="color: white">專科</p></label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" name="groupDegree"
                         type="radio" id="radioDegreeSenior" (click)="changeDegree('高中')">
                  <label class="form-check-label" for="radioDegreeSenior"><p style="color: white">高中</p></label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" name="groupDegree"
                         type="radio" id="radioDegreeJunior" (click)="changeDegree('國中')">
                  <label class="form-check-label" for="radioDegreeJunior"><p style="color: white">國中</p></label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" name="groupDegree"
                         type="radio" id="radioDegreeUnderJunior" (click)="changeDegree('國中以下')">
                  <label class="form-check-label" for="radioDegreeUnderJunior"><p style="color: white">國中以下</p></label>
                </div>
              </div>
              <input type="text" name="formDegreeSchool" class="form-control mt-1" placeholder="校名" [(ngModel)]="formSchool">
              <input type="text" name="formDegreeDepartment" class="form-control mt-1" placeholder="系所" [(ngModel)]="formDepartment">
            </div>
            <p style="color: white">外語能力</p>
            <div class="form-group">
              <div class="row">
                <div class="custom-control custom-checkbox ml-3 mr-2">
                  <input #langEngInput type="checkbox" class="custom-control-input" id="form-language-eng"
                         (click)="setLanguageEnglish(langEngInput.value)">
                  <label class="custom-control-label" for="form-language-eng">英語</label>
                </div>
                <div class="custom-control custom-checkbox">
                  <input #langJapInput type="checkbox" class="custom-control-input" id="form-language-jap"
                         (click)="setLanguageJapaness(langJapInput.value)">
                  <label class="custom-control-label" for="form-language-jap">日語</label>
                </div>
              </div>
              <input type="text" name="formLanguageOthers" class="form-control mt-1" placeholder="其他語言" [(ngModel)]="formLanguageOthers">
            </div>
            <p style="color: white">服務單位 (四選一)</p>
            <div class="form-group">
              <div class="row no-gutters">
                <div class="col-lg-1 col-md-2 mt-1">
                  <input class="form-check-input" name="groupOccupation"
                         type="radio" id="radioOccupationWork" (click)="changeOccupation('在職')">
                  <label class="form-check-label" for="radioOccupationWork">在職</label>
                </div>
                <div class="col-lg-2 col-md-4 mr-md-2">
                  <input type="text" name="formOccupationWorkDepartment" class="form-control" placeholder="服務單位"
                         [(ngModel)]="formOccupationWorkDepartment">
                </div>
                <div class="col-lg-2 col-md-4">
                  <input type="text" name="formOccupationWorkTitle" class="form-control" placeholder="職稱"
                         [(ngModel)]="formOccupationWorkTitle">
                </div>
              </div>
              <div class="row no-gutters mt-1">
                <div class="col-lg-1 col-md-2 mt-1">
                  <input class="form-check-input d-inline" name="groupOccupation"
                         type="radio" id="radioOccupationRetirement" (click)="changeOccupation('退休')">
                  <label class="form-check-label" for="radioOccupationRetirement">退休</label>
                </div>
                <div class="col-lg-2 col-md-4 mr-md-2">
                  <input type="text" name="formOccupationRetirementDepartment" class="form-control" placeholder="服務單位"
                         [(ngModel)]="formOccupationRetirementDepartment">
                </div>
                <div class="col-lg-2 col-md-4">
                  <input type="text" name="formOccupationRetirementTitle" class="form-control" placeholder="職稱"
                         [(ngModel)]="formOccupationRetirementTitle">
                </div>
              </div>
              <div class="row no-gutters mt-1">
                <div class="col-lg-1 col-md-2 mt-1">
                  <input class="form-check-input" name="groupOccupation"
                         type="radio" id="radioOccupationStudent" (click)="changeOccupation('學生')">
                  <label class="form-check-label" for="radioOccupationStudent">學生</label>
                </div>
                <div class="col-lg-2 col-md-4 mr-md-2">
                  <input type="text" name="formOccupationStudentSchool" class="form-control" placeholder="就讀學校"
                         [(ngModel)]="formOccupationStudentSchool">
                </div>
                <div class="col-lg-2 col-md-4">
                  <input type="text" name="formOccupationStudentDepartment" class="form-control" placeholder="系所"
                         [(ngModel)]="formOccupationStudentDepartment">
                </div>
              </div>
              <div class="row no-gutters mt-1">
                <div class="col-lg-1 col-md-2 mt-1">
                  <input class="form-check-input" name="groupOccupation"
                         type="radio" id="radioOccupationOthers" (click)="changeOccupation('其他')">
                  <label class="form-check-label" for="radioOccupationOthers">其他</label>
                </div>
                <div class="col-lg-2 col-md-4">
                  <input type="text" name="formOccupationOthers" class="form-control" placeholder="其他" [(ngModel)]="formOccupationOthers">
                </div>
              </div>
              <div class="form-group mt-3">
                <textarea type="text" placeholder="工作經歷"class="md-textarea form-control" rows="3"
                          [(ngModel)]="formWorkExperience"></textarea>
              </div>
              <div class="form-group">
                <textarea type="text" placeholder="志工經歷" class="md-textarea form-control" rows="3"
                          [(ngModel)]="formVolunteerExperience"></textarea>
              </div>
              <div class="row" style="margin-left: 0px">
                <p style="color: white">志工手冊</p>
                <div class="form-check">
                  <input name="groupVolunteerBook" type="radio" id="radioVolunteerYes" class="form-check-input"
                         (click)="changeVolunteerBook(true)">
                  <label class="form-check-label" for="radioVolunteerYes"><p style="color: white">有</p></label>
                </div>
                <div class="form-check">
                  <input name="groupVolunteerBook" type="radio" id="radioVolunteerNo" class="form-check-input"
                         (click)="changeVolunteerBook(false)">
                  <label class="form-check-label" for="radioVolunteerNo"><p style="color: white">無</p></label>
                </div>
              </div>
              <div class="form-group">
                <textarea type="text" [(ngModel)]="formReason" placeholder="申請動機" class="md-textarea form-control" rows="3"></textarea>
              </div>
              <div class="form-group">
                <textarea type="text" [(ngModel)]="formIntroduce" placeholder="自我介紹" class="md-textarea form-control" rows="3"></textarea>
              </div>
              <p style="color: white">上傳大頭照(300KB)</p>
              <input mdbInputDirective type="file" class="form-control" (change)="this.formFile = $event.target.files[0]">
            </div>
            <div *ngIf="uploading === true" style="height: 20px; background-color: burlywood"
                 [ngStyle]="{'width' : uploadPercent | async}">
              {{ uploadPercent | async }}
            </div>
            <p class="float-right"><input type="submit" class="btn btn-default" value="確認送出" (click)="submit()"></p>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid" style="position: absolute; z-index: 1">
      <div class="row">
        <div class="col-11">
          <div class="float-right" (click)="form_photo.show()">
            <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
              <i class="fa fa-edit"> </i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div mdbModal #form_carousel="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title"><i class="fa fa-pencil"></i> 贊助炫光圖片編輯 </h4>
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

    <div mdbModal #form_desc="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title"><i class="fa fa-pencil"></i> 贊助炫光描述編輯 </h4>
            <button id="form-description-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_desc.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <div class="row">
                <div class="col-12">
                  <textarea #description type="text" class="md-textarea form-control" rows="6" value="{{ this.donation.description }}">
                  </textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-1-half">
            <button class="btn btn-info mb-2 waves-light" mdbWavesEffect (click)="updateDescription(description.value)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div mdbModal #form_plan="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title"><i class="fa fa-pencil"></i> 贊助炫光招募計畫編輯 </h4>
            <button id="form-plan-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_plan.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <div class="row">
                <div class="col-12">
                  <textarea #plan type="text" class="md-textarea form-control" rows="6" value="{{ this.donation.plan }}">
                  </textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-1-half">
            <button class="btn btn-info mb-2 waves-light" mdbWavesEffect (click)="updatePlan(plan.value)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div mdbModal #form_photo="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title"><i class="fa fa-pencil"></i> 贊助炫光招募計畫圖片編輯 </h4>
            <button id="form-photo-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_photo.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <div class="row">
                <div class="col-6 border-dark">
                  <app-image-ratio-component image="{{ this.planPhoto1Image|async }}}" ratio="16:9">
                  </app-image-ratio-component>
                  <input mdbInputDirective type="file" class="form-control" (change)="this.inputImage1 = $event.target.files[0]">
                </div>
                <div class="col-6 border-dark">
                  <app-image-ratio-component image="{{ this.planPhoto2Image|async }}}" ratio="16:9">
                  </app-image-ratio-component>
                  <input mdbInputDirective type="file" class="form-control" (change)="this.inputImage2 = $event.target.files[0]">
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <input #title1 type="text" class="form-control" placeholder="標題" value="{{ this.donation.photo1title }}">
                </div>
                <div class="col-6">
                  <input #title2 type="text" class="form-control" placeholder="標題" value="{{ this.donation.photo2title }}">
                </div>
              </div>
              <div *ngIf="uploadingImage1 === true" style="height: 20px; background-color: burlywood"
                   [ngStyle]="{'width' : uploadImage1Percent | async}">
                {{ uploadImage1Percent | async }}
              </div>
              <div *ngIf="uploadingImage2 === true" style="height: 20px; background-color: burlywood"
                   [ngStyle]="{'width' : uploadImage2Percent | async}">
                {{ uploadImage2Percent | async }}
              </div>
            </div>
          </div>
          <div class="text-center mt-1-half">
            <button class="btn btn-info mb-2 waves-light" mdbWavesEffect (click)="updatePhoto(title1.value, title2.value)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
  `]
})
export class AdministratorPageDonationComponents implements OnDestroy {
  uploadingImage1 = false;
  uploadingImage2 = false;
  uploadingCarousel = false;
  inputImage1: HTMLInputElement;
  inputImage2: HTMLInputElement;
  uploadImage1Percent: Observable<string>;
  uploadImage2Percent: Observable<string>;
  carouselInputImages: HTMLInputElement[] = new Array(1);
  carouselUploadPercents: Observable<string>[] = new Array(1);

  private subscription;
  displayPlan = true;
  displayForm = false;
  donation = new DonationModel('');
  carouselImageList: Observable<string[]>;
  planPhoto1Image: Observable<string>;
  planPhoto2Image: Observable<string>;

  date = Date();
  year = new Date().getFullYear();
  formFile: HTMLInputElement;
  formName = '';
  formSex = '';
  formBirthday = '';
  formHomePhone = '';
  formCellPhone = '';
  formCompanyPhone = '';
  formMail = '';
  formAddress = '';
  formDegree = '';
  formSchool = '';
  formDepartment = '';
  formLanguageEng = false;
  formLanguageJap = false;
  formLanguageOthers = '';
  formOccupationType = '';
  formOccupationWorkDepartment = '';
  formOccupationWorkTitle = '';
  formOccupationRetirementDepartment = '';
  formOccupationRetirementTitle = '';
  formOccupationStudentSchool = '';
  formOccupationStudentDepartment = '';
  formOccupationOthers = '';
  formWorkExperience = '';
  formVolunteerExperience = '';
  formHaveVolunteerBook = '';
  formReason = '';
  formIntroduce = '';
  private _uploadedFileUrl: string;
  uploadPercent: Observable<string>;
  uploading = false;
  toastFlag = true;
  formKey = '';
  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private toastService: ToastService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.getCarouselImageList();
    this.subscription = this.database.object('donation').snapshotChanges()
      .subscribe(json => {
        this.donation = new DonationModel(json.payload.val());
      });
  }
  private getCarouselImageList() {
    this.carouselImageList = zip(
      this.storage.ref('donation/carousel/image_0').getDownloadURL().pipe(catchError(_ => of(''))));
    this.planPhoto1Image = this.storage.ref('donation/plan/image_1').getDownloadURL().pipe(catchError(_ => of('')));
    this.planPhoto2Image = this.storage.ref('donation/plan/image_2').getDownloadURL().pipe(catchError(_ => of('')));
  }
  deleteCarouselFile(elementRef: ElementRef, index: number) {
    this.storage.ref('donation/carousel/image_' + index).delete();
    this.getCarouselImageList();
  }
  uploadCarouselFile() {
    this.uploadingCarousel = true;
    const observableList$: Observable<string>[] = [];
    this.carouselInputImages.forEach((image, index) => {
      const task = this.storage.ref('donation/carousel/image_' + index).put(image);
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
  updateDescription(text: string) {
    this.database.object('donation')
      .update({ description: text })
      .then(_ => {
        (document.getElementById('form-description-close-btn') as HTMLElement).click();
      }, reason => {
        (document.getElementById('form-description-close-btn') as HTMLElement).click();
      });
  }
  updatePlan(text: string) {
    this.database.object('donation')
      .update({ plan: text })
      .then(_ => {
        (document.getElementById('form-plan-close-btn') as HTMLElement).click();
      }, reason => {
        (document.getElementById('form-plan-close-btn') as HTMLElement).click();
      });
  }
  updatePhoto(title1: string, title2: string) {
    const observableList$: Observable<string>[] = [];
    if (this.inputImage1 != null) {
      this.uploadingImage1 = true;
      const task1 = this.storage.ref('donation/plan/image_1').put(this.inputImage1);
      this.uploadImage1Percent =  task1.percentageChanges().pipe(
        map((number) => number + '%')
      );
      observableList$.push(this.uploadImage1Percent);
    }
    if (this.inputImage2 != null) {
      this.uploadingImage2 = true;
      const task2 = this.storage.ref('donation/plan/image_2').put(this.inputImage2);
      this.uploadImage1Percent =  task2.percentageChanges().pipe(
        map((number) => number + '%')
      );
      observableList$.push(this.uploadImage2Percent);
    }
    zip(...observableList$)
      .subscribe(value => {
        let check = true;
        for (const element of value) {
          if (element !== '100%') {
            check = false;
          }
        }
        if (check) {
          (document.getElementById('form-photo-close-btn') as HTMLElement).click();
          this.getCarouselImageList();
        }
      });
    this.database.object('donation')
      .update({ photo1title: title1, photo2title: title2 })
      .then(_ => {
        (document.getElementById('form-photo-close-btn') as HTMLElement).click();
      }, reason => {
        (document.getElementById('form-photo-close-btn') as HTMLElement).click();
      });
  }
  showForm() {
    this.displayPlan = false;
    this.displayForm = true;
  }
  showPlan() {
    this.displayPlan = true;
    this.displayForm = false;
  }

  changeSex(sex: string) {
    this.formSex = sex;
  }
  changeDegree(degree: string) {
    this.formDegree = degree;
  }
  setLanguageEnglish(selected: boolean) {
    this.formLanguageEng = selected;
  }
  setLanguageJapaness(selected: boolean) {
    this.formLanguageJap = selected;
  }
  changeOccupation(type: string) {
    this.formOccupationType = type;
  }
  changeVolunteerBook(have: boolean) {
    this.formHaveVolunteerBook = have ? '有' : '無';
  }

  @Input()
  set uploadedFileUrl(url: string) {
    if (this._uploadedFileUrl !== url) {
      this._uploadedFileUrl = url;
      this.database.object('donation/volunteer/form/' + this.year + '/' + this.formKey)
        .update({ fileUrl: url })
        .then(_ => {
          if (this.toastFlag) {
            this.toastFlag = false;
            let language = '';
            if (this.formLanguageEng) {
              language += '英語';
            }
            if (this.formLanguageJap) {
              if (language !== '') {
                language += ',';
              }
              language += '日語';
            }
            if (this.formLanguageOthers !== '') {
              if (language !== '') {
                language += ',';
              }
              language += this.formLanguageOthers;
            }
            let occupation = this.formOccupationType;
            if (this.formOccupationType === '在職') {
              occupation = occupation + '/' + this.formOccupationWorkDepartment + '/' + this.formOccupationWorkTitle;
            } else if (this.formOccupationType === '退休') {
              occupation = occupation + '/' + this.formOccupationRetirementDepartment + '/' + this.formOccupationRetirementTitle;
            } else if (this.formOccupationType === '學生') {
              occupation = occupation + '/' + this.formOccupationStudentSchool + '/' + this.formOccupationStudentDepartment;
            } if (this.formOccupationType === '其他') {
              occupation = occupation + '/' + this.formOccupationOthers;
            }
            const html = `<div>申請人: </div><div><img src="${url}"></div>
<div>申請人姓名: ${this.formName} ${this.formSex}</div>
<div>生日: ${this.formBirthday}</div>
<div>住家電話: ${this.formHomePhone}</div>
<div>行動電話: ${this.formCellPhone}</div>
<div>公司電話: ${this.formCompanyPhone}</div>
<div>電子郵件: <a href="mailto:${this.formMail}">${this.formMail}</a></div>
<div>聯絡地址: ${this.formAddress}</div>
<div>學歷: ${this.formDegree}</div>
<div>校名: ${this.formSchool}</div>
<div>系所: ${this.formDepartment}</div>
<div>外語能力: ${language}</div>
<div>服務單位: ${occupation}</div>
<div>工作經歷: ${this.formWorkExperience}</div>
<div>志工經歷: ${this.formVolunteerExperience}</div>
<div>志工手冊: ${this.formHaveVolunteerBook}</div>
<div>申請動機: ${this.formReason}</div>
<div>自我介紹: ${this.formIntroduce}</div>
<div>表單送出時間: ${this.date}</div>`;
            this.database.object('sendBox/' + this.formKey)
              .set({
                title: '成人志工申請_' + this.formName,
                html: html,
                date: this.date
              })
              .then(result => {
                this._uploadedFileUrl = null;
                this.uploading = false;
                this.formKey = null;
                this.formFile = null;
                this.formName = '';
                this.formSex = '';
                this.formBirthday = '';
                this.formHomePhone = '';
                this.formCellPhone = '';
                this.formCompanyPhone = '';
                this.formMail = '';
                this.formAddress = '';
                this.formDegree = '';
                this.formSchool = '';
                this.formDepartment = '';
                this.formLanguageEng = false;
                this.formLanguageJap = false;
                this.formLanguageOthers = '';
                this.formOccupationType = '';
                this.formOccupationWorkDepartment = '';
                this.formOccupationWorkTitle = '';
                this.formOccupationRetirementDepartment = '';
                this.formOccupationRetirementTitle = '';
                this.formOccupationStudentSchool = '';
                this.formOccupationStudentDepartment = '';
                this.formOccupationOthers = '';
                this.formWorkExperience = '';
                this.formVolunteerExperience = '';
                this.formHaveVolunteerBook = '';
                this.formReason = '';
                this.formIntroduce = '';
                this.toastService.success('表單送出成功！');
              });
          }
        }, reason => {
          this.uploading = false;
          this.toastService.error('表單送出失敗，請稍候再試。');
        });
    }
  }
  get uploadedFileUrl() {
    return this._uploadedFileUrl;
  }
  submit() {
    this.date = Date();
    if (this.formName === '') {
      alert('請輸入申請人姓名');
    } else if (this.formSex === '') {
      alert('請選擇申請人性別');
    } else if (this.formBirthday === '') {
      alert('請輸入生日');
    } else if (this.formHomePhone === '' && this.formCellPhone === '' && this.formCompanyPhone === '') {
      alert('請輸入至少一個聯絡電話');
    } else if (this.formMail === '') {
      alert('請輸入 Email');
    } else if (this.formAddress === '') {
      alert('請輸入聯絡地址');
    } else if (this.formDegree === '') {
      alert('請選擇您的學歷');
    } else if (this.formSchool === '') {
      alert('請輸入就讀學校');
    } else if (this.formDepartment === '') {
      alert('請輸入就讀科系');
    } else if (this.formOccupationType === '') {
      alert('請選擇服務單位');
    } else if (this.formOccupationType === '在職' && this.formOccupationWorkDepartment === '') {
      alert('請輸入服務單位');
    } else if (this.formOccupationType === '在職' && this.formOccupationWorkTitle === '') {
      alert('請輸入職稱');
    } else if (this.formOccupationType === '退休' && this.formOccupationRetirementDepartment === '') {
      alert('請輸入服務單位');
    } else if (this.formOccupationType === '退休' && this.formOccupationRetirementTitle === '') {
      alert('請輸入職稱');
    } else if (this.formOccupationType === '學生' && this.formOccupationStudentSchool === '') {
      alert('請輸入就讀學校');
    } else if (this.formOccupationType === '學生' && this.formOccupationStudentDepartment === '') {
      alert('請輸入就讀系所');
    } else if (this.formOccupationType === '其他' && this.formOccupationOthers === '') {
      alert('請輸入其他服務單位');
    } else if (this.formWorkExperience === '') {
      alert('請輸入工作經歷');
    } else if (this.formVolunteerExperience === '') {
      alert('請輸入志工經驗');
    } else if (this.formHaveVolunteerBook === '') {
      alert('請選擇有無志工手冊');
    } else if (this.formReason === '') {
      alert('請輸入申請動機');
    } else if (this.formIntroduce === '') {
      alert('請輸入自我介紹');
    } else if (this.formFile == null) {
      alert('請選擇一張大頭照');
    } else if (this.formFile != null && this.formFile.type !== 'image/jpg'
      && this.formFile.type !== 'image/jpeg' && this.formFile.type !== 'image/png') {
      alert('圖片必須為 jpg/png 格式');
    } else if (this.formFile != null && this.formFile.size > 1024 * 300) {
      alert('圖片大小不得超過 300KB');
    } else {
      this.uploading = true;
      this.database.list('donation/volunteer/form/' + this.year)
        .push({
          name: this.formName,
          sex: this.formSex,
          birthday: this.formBirthday,
          homePhone: this.formHomePhone,
          cellPhone: this.formCellPhone,
          companyPhone: this.formCompanyPhone,
          email: this.formMail,
          address: this.formAddress,
          degree: this.formDegree,
          degreeSchool: this.formSchool,
          degreeDepartment: this.formDepartment,
          languageEng: this.formLanguageEng,
          languageJap: this.formLanguageJap,
          languageOthers: this.formLanguageOthers,
          occupationType: this.formOccupationType,
          occupationWorkDepartment: this.formOccupationWorkDepartment,
          occupationWorkTitle: this.formOccupationWorkTitle,
          occupationRetirementDepartment: this.formOccupationRetirementDepartment,
          occupationRetirementTitle: this.formOccupationRetirementTitle,
          occupationStudentSchool: this.formOccupationStudentSchool,
          occupationStudentDepartment: this.formOccupationStudentDepartment,
          occupationOthers: this.formOccupationOthers,
          workExperience: this.formWorkExperience,
          volunteerExperience: this.formVolunteerExperience,
          volunteerBookHave: this.formHaveVolunteerBook,
          reason: this.formReason,
          introduce: this.formIntroduce,
          fileUrl: 'fileUploading',
          createdAt: this.date,
        })
        .then(result => {
          this.toastFlag = true;
          this.formKey = result.key;
          const fileRef = 'donation/volunteer/form/' + this.year + '/' + result.key;
          const task = this.storage.upload(fileRef, this.formFile);
          this.uploadPercent = task.percentageChanges().pipe(delay(1000)).pipe(
            map((number) => {
              if (number === 100) {
                this.storage.ref(fileRef)
                  .getDownloadURL()
                  .pipe(delay(1000))
                  .pipe(retry(2))
                  .subscribe(value => {
                    this.uploadedFileUrl = value;
                  });
              }
              return number + '%';
            })
          );
        });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
