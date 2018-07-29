import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {SettingService} from '../core/setting.service';
import {DonationModel} from '../model/donation.model';
import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  template: `
    <div class="row">
      <div class="col-1"></div>
      <div class="col-5">
        <div class="float-right" (click)="form_edit.show();">
          <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
            <i class="fa fa-edit"> </i>
          </a>
        </div>
        <app-page-title-component title="聯絡我們" topImage=false></app-page-title-component>
        <ng-container *ngIf="donation.key !== ''">
          <div class="mt-5">
            <ng-container *ngFor="let text of donation.description|stringNewLine">
              <p>{{ text }}</p>
            </ng-container>
          </div>
          <agm-map [latitude]="donation.lat" [longitude]="donation.lng" [zoom]="donation.zoomValue">
            <agm-marker [latitude]="donation.lat" [longitude]="donation.lng"></agm-marker>
          </agm-map>
        </ng-container>
      </div>
      <div class="col-5">
        <app-page-title-component title="贊助炫光" topImage=false></app-page-title-component>
        <div class="mt-5">
          <form #form class="container" (ngSubmit)="submit()" #donationForm="ngForm">
            <div class="form-group">
              <strong>個人/公司/組織 聯絡電話</strong>
              <p>此資料僅供我們聯絡您，不會公佈也不會外洩此筆資料。</p>
              <input type="text"
                     name="formPhone"
                     class="form-control"
                     placeholder="required"
                     required [(ngModel)]="formPhone">
            </div>
            <div class="form-group">
              <strong>個人/公司/組織 聯絡 MAIL</strong>
              <p>請務必留下您一定會收信之信箱，此資料僅供我們聯絡您，不會公佈也不會外洩此筆資料。</p>
              <input type="email"
                     name="formMail"
                     class="form-control"
                     placeholder="required"
                     required [(ngModel)]="formMail">
            </div>
            <div class="form-group">
              <strong>公告贊助者時，是否需要公開您填寫的名稱？</strong>
              <p>針對每筆贊助都會公告在網頁上，我們預設是隱匿贊助者名稱，如你希望公開名稱請點選此項，如未點選我們將不會公開您的名稱。</p>
              <div class="form-group">
                <input type="checkbox" name="isPublic" id="check1" [(ngModel)]="isPublic">
                <label for="check1"> 是，請公開我的名稱</label>
              </div>
            </div>
            <div class="form-group">
              <strong>您的姓名/公司名稱/組織名稱</strong>
              <input type="text"
                     name="formName"
                     class="form-control"
                     placeholder="required"
                     required
                     [(ngModel)]="formName">
            </div>
            <div class="form-group">
              <strong>您轉帳的帳號</strong>
              <p>我們需要您轉帳的帳號，以方便確認您是否成功轉帳與轉帳金額。</p>
              <input type="text"
                     name="formAccount"
                     class="form-control"
                     placeholder="required"
                     required
                     [(ngModel)]="formAccount">
            </div>
            <div class="form-group">
              <strong>您將贊助的金額</strong>
              <input type="number"
                     name="formAmount"
                     class="form-control"
                     placeholder="required"
                     min="1"
                     required
                     [(ngModel)]="formAmount">
            </div>
            <p class="float-right">
              <input type="submit" class="btn btn-success" value="提交" [disabled]="form.invalid">
            </p>
          </form>
        </div>
      </div>
      <div class="col-1"></div>
    </div>
    <div mdbModal #form_edit="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title"><i class="fa fa-pencil"></i> 聯絡資訊編輯 </h4>
            <button id="form-edit-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form_edit.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
                <textarea #content mdbInputDirective type="text"
                          class="md-textarea form-control" rows="10" value="{{ donation.description }}"></textarea>
            </div>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
              <div class="row">
                <p>地圖座標</p>
                <input #latitude type="text" class="form-control"
                       placeholder="偉度" value="{{ donation.lat }}">
                <input #longitude type="text" class="form-control"
                       placeholder="經度" value="{{ donation.lng }}">
                <input #zoom type="text" class="form-control"
                       placeholder="放大倍數" value="{{ donation.zoomValue }}">
              </div>
            </div>
          </div>
          <div class="text-center mt-1-half">
            <button class="btn btn-info mb-2 waves-light" mdbWavesEffect
                    (click)="update(content.value, latitude.value, longitude.value, zoom.value)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    agm-map {
      height: 300px;
    }
  `]
})
export class PageDonationComponent implements OnDestroy {
  private subscription;
  isPublic = false;
  formAccount = '';
  formAmount = '';
  formPhone = '';
  formMail = '';
  formName = '';
  donation = new DonationModel('', '');
  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.subscription = this.database.object('donation').snapshotChanges()
      .subscribe(json => {
        this.donation = new DonationModel(json.payload.val());
      });
  }
  update(content: string, lat: string, lng: string, zoom: string) {
    this.database.object('donation/')
      .update({description: content, latitude: Number(lat), longitude: Number(lng), zoomValue: Number(zoom)})
      .then(_ => {
        (document.getElementById('form-edit-close-btn') as HTMLElement).click();
      });
  }

  submit() {
    console.log('submit/' + this.isPublic + '/' + this.formPhone + '/' + this.formMail + '/' + this.formName +
      '/' + this.formAccount + '/' + this.formAmount);
    if (this.formName === '') {
      alert('請輸入姓名');
    } else if (this.formPhone === '') {
      alert('請輸入電話');
    } else if (this.formMail === '') {
      alert('請輸入 Email');
    } else if (this.formAccount === '') {
      alert('請輸入帳戶');
    } else if (this.formAmount === '') {
      alert('請輸入金額');
    } else {
      const date = Date();
      let isPublic = '否';
      if (this.isPublic) {
        isPublic = '是';
      }
      const html = `
        <div>姓名: ${this.formName}</div>
        <div>Email: <a href="mailto:${this.formMail}">${this.formMail}</a></div>
        <div>電話: ${this.formPhone}</div>
        <div>帳戶: ${this.formAccount}</div>
        <div>金額: ${this.formAmount}</div>
        <div>表單送出時間: ${date}</div>
        <div>是否願意公開？: ${isPublic}</div>
      `;
      this.database.list('donation/messages/')
        .push({
          name: this.formName,
          email: this.formMail,
          phone: this.formPhone,
          isPublic: this.isPublic,
          amount: this.formAmount,
          account: this.formAccount,
          html: html
        })
        .then(result => {
          this.isPublic = false;
          this.formAccount = '';
          this.formAmount = '';
          this.formPhone = '';
          this.formMail = '';
          this.formName = '';
          alert('表單送出成功！');
        });
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
