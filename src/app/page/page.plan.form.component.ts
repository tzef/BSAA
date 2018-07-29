import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {ToastService} from 'ng-uikit-pro-standard';
import {delay, map, retry} from 'rxjs/operators';
import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  template: `
    <div class="container">
      <h5 class="mt-5">炫光計劃報名表</h5>
      <div class="row mt-2">
        <div class="col-md-6">
          <div class="form-group">
            <strong>1. 作品上傳</strong>
            <p>JPG檔/大小 1MB 以內</p>
            <input mdbInputDirective type="file" class="form-control" (change)="this.formFile = $event.target.files[0]">
            <br>
            <p>或影音檔連結</p>
            <input type="text"
                   name="formVideoUrl"
                   class="form-control"
                   placeholder="ex: https://www.youtube.com/watch?v=XXXXXXXX"
                   [(ngModel)]="formVideoUrl">
            <p>備註：每人限傳一件作品：音樂、歌唱、舞蹈、戲劇等表演藝術或錄像作品，請以 3 分鐘為限，平面或立體作品長寬高限制在 100 公分以內。
            </p>
          </div>
          <div class="form-group">
            <strong>2. 姓名</strong>
            <input type="text"
                   name="formName"
                   class="form-control"
                   placeholder="ex: 徐英豪"
                   required [(ngModel)]="formName">
          </div>
          <div class="form-group">
            <strong>3. 年齡<span style="font-size: 12px; color: darkgray;">(13-22 歲)</span></strong>
            <input type="number"
                   name="formAge"
                   class="form-control"
                   placeholder="ex: 18"
                   required [(ngModel)]="formAge">
          </div>
          <div class="form-group">
            <strong>4. 連絡地址</strong>
            <input type="text"
                   name="formAddress"
                   class="form-control"
                   placeholder="ex: 新北市淡水區強強路1000巷10號"
                   required [(ngModel)]="formAddress">
          </div>
          <div class="form-group">
            <strong>5. 電話</strong>
            <input type="text"
                   name="formHomePhone"
                   class="form-control"
                   placeholder="住家"
                   [(ngModel)]="formHomePhone">
            <input type="text"
                   name="formCellPhone"
                   class="form-control"
                   placeholder="手機"
                   [(ngModel)]="formCellPhone">
          </div>
          <div class="form-group">
            <strong>6. MAIL</strong>
            <input type="email"
                   name="formMail"
                   class="form-control"
                   placeholder="ex: aa45678@gmail.com"
                   required [(ngModel)]="formMail">
          </div>
          <div class="form-group">
            <strong>7. 就讀學校</strong>
            <input type="text"
                   name="formSchool"
                   class="form-control"
                   placeholder="ex: 台北藝術大學美術學系"
                   required [(ngModel)]="formSchool">
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <strong>8. 自我介紹</strong>
            <textarea type="text" [(ngModel)]="formIntroduce"
                      placeholder="ex: 熱愛東方文化。覺得悲劇非常美。或許是相由心生，沒表情的時候看起來很憂鬱。生長在桃園市郊，
這裡一直有一種冷清的感覺，尤其陰雨天，窗外的一切看起來都帶著濃厚的疏離感。畫畫，是我最喜歡的事，能抒發情緒更能帶動成長，如果可以的話，
我希望就這麼一直畫下去。" class="md-textarea form-control" rows="5"></textarea>
          </div>
          <div class="form-group">
            <strong>9. 理想<span style="font-size: 12px; color: darkgray;">(可填可不填)</span></strong>
            <textarea type="text" [(ngModel)]="formDream"
                      class="md-textarea form-control" rows="6"></textarea>
          </div>
          <div class="form-group">
            <strong>10. 作品創作理念<span style="font-size: 12px; color: darkgray;">(300字為限)</span></strong>
            <textarea type="text" [(ngModel)]="formCreateConcept"
                      placeholder="ex: 當地震、海嘯、火山爆發等天然災害來臨前，均會產生頻率非常低的聲波，即「次聲波」。
  次聲波是指頻率小於20赫茲（人耳能聽見的最小頻率），但是高於氣候造成的氣壓變動的聲波。人耳基本上聽不到次聲波，但是能通過其波壓感受到，
  而有些動物能直接聽到次聲波並且避開災難。我藉由人與次聲波之間的關係，來表達自己對於禍患來臨之前的感受。
  禍患雖然無法預知，但在發生之前往往會有預感，可能在一早醒來、駕駛途中、電話響起的瞬間、或是異於尋常的話語。一切一如往常，也說不出哪裡不對勁，
  或許真的會發生什麼事情，有時也可能只是杞人憂天。
  " class="md-textarea form-control" rows="12"></textarea>
          </div>
          <div *ngIf="uploading === true" style="height: 20px; background-color: burlywood"
               [ngStyle]="{'width' : uploadPercent | async}">
            {{ uploadPercent | async }}
          </div>
          <p class="float-right">
            <input type="submit" class="btn btn-dark" value="提交" (click)="submit()">
          </p>
        </div>
      </div>
    </div>
  `
})
export class PagePlanFormComponent {
  date = Date();
  year = new Date().getFullYear();
  formFile: HTMLInputElement;
  formVideoUrl = '';
  formName = '';
  formAge = '';
  formAddress = '';
  formHomePhone = '';
  formCellPhone = '';
  formMail = '';
  formSchool = '';
  formIntroduce = '';
  formDream = '';
  formCreateConcept = '';
  formKey = '';
  uploading = false;
  toastFlag = true;
  private _uploadedFileUrl: string;
  uploadPercent: Observable<string>;

  constructor(private database: AngularFireDatabase, private storage: AngularFireStorage, private toastService: ToastService) {}

  @Input()
  set uploadedFileUrl(url: string) {
    if (this._uploadedFileUrl !== url) {
      this._uploadedFileUrl = url;
      this.database.object('plan/form/' + this.year + '/' + this.formKey)
        .update({ fileUrl: url })
        .then(_ => {
          if (this.toastFlag) {
            this.toastFlag = false;
            const html = `<div>作品: </div><div><img src="${url}"></div><div>姓名: ${this.formName}</div><div>年齡: ${this.formAge}</div>
<div>聯絡地址: ${this.formAddress}</div><div>住家電話: ${this.formHomePhone}</div><div>手機號碼: ${this.formCellPhone}</div>
<div>Email: <a href="mailto:${this.formMail}">${this.formMail}</a></div><div>就讀學校: ${this.formSchool}</div>
<div>自我介紹: ${this.formIntroduce}</div><div>理想: ${this.formDream}</div><div>創作理念: ${this.formCreateConcept}</div>
<div>表單送出時間: ${this.date}</div>`;
            this.database.object('sendBox/' + this.formKey)
              .set({
                title: '報名本屆炫光_' + this.formName,
                html: html,
                date: this.date
              })
              .then(result => {
                this._uploadedFileUrl = null;
                this.uploading = false;
                this.formKey = null;
                this.formFile = null;
                this.formVideoUrl = '';
                this.formName = '';
                this.formAge = '';
                this.formAddress = '';
                this.formHomePhone = '';
                this.formCellPhone = '';
                this.formMail = '';
                this.formSchool = '';
                this.formIntroduce = '';
                this.formDream = '';
                this.formCreateConcept = '';
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
    console.log('submit/' + this.formVideoUrl + '/' + this.formName + '/' + this.formAge + '/' + this.formAddress +
      '/' + this.formHomePhone + '/' + this.formCellPhone + '/' + this.formCellPhone + '/' + this.formMail +
      '/' + this.formSchool + '/' + this.formIntroduce + '/' + this.formDream + '/' + this.formCreateConcept);
    if (this.formFile == null) {
      alert('請選擇一張圖片');
    } else if (this.formFile.type !== 'image/jpeg' && this.formFile.type !== 'image/jpg') {
      alert('圖片格式只接收 JPG 檔案');
    } else if (this.formFile.size > 1024 * 1000) {
      alert('檔案大小必需在 1MB 以內');
    } else if (this.formName === '') {
      alert('請輸入姓名');
    } else if (this.formAge === '') {
      alert('請輸入年齡');
    } else if (Number(this.formAge) < 13 || Number(this.formAge) > 22) {
      alert('年齡必需在 13-22 歲');
    } else if (this.formAddress === '') {
      alert('請輸入聯絡地址');
    } else if (this.formHomePhone === '' && this.formCellPhone === '') {
      alert('請輸入住家電話或手機電話');
    } else if (this.formMail === '') {
      alert('請輸入 Email');
    } else if (this.formSchool === '') {
      alert('請輸入就讀學校');
    } else if (this.formIntroduce === '') {
      alert('請輸入自我介紹');
    } else if (this.formCreateConcept === '') {
      alert('請輸入創作理念');
    } else if (this.formCreateConcept.length > 300) {
      alert('創作理念字數不得超過 300 字');
    } else {
      this.uploading = true;
      this.database.list('plan/form/' + this.year)
        .push({
          name: this.formName,
          age: this.formAge,
          address: this.formAddress,
          homePhone: this.formHomePhone,
          cellPhone: this.formCellPhone,
          email: this.formMail,
          school: this.formSchool,
          introduce: this.formIntroduce,
          dream: this.formDream,
          createConcept: this.formCreateConcept,
          fileUrl: 'fileUploading',
          createdAt: this.date,
        })
        .then(result => {
          this.toastFlag = true;
          this.formKey = result.key;
          const fileRef = 'plan/form/' + this.year + '/' + result.key;
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
}
