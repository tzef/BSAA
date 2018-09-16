import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {ToastService} from 'ng-uikit-pro-standard';
import {ActivatedRoute} from '@angular/router';
import {EventModel} from '../model/event.model';

@Component({
  template: `
    <div class="container">
      <h5 class="mt-5">炫光小學堂活動報名表</h5>
      <h5>活動名稱： {{ this.event.title }}</h5>
      <div class="row mt-2">
        <div class="col-md-12">
          <div class="form-group">
            <strong>1. 姓名</strong>
            <input type="text"
                   name="formName"
                   class="form-control"
                   required [(ngModel)]="formName">
          </div>
          <div class="form-group">
            <strong>2. 性別</strong>
            <div class="row" style="margin-left: 0px">
              <div class="form-check mr-3 col-sm-1 col-2">
                <input name="groupSex" type="radio" id="radioMale" class="form-check-input" (click)="changeSex('男')">
                <label class="form-check-label" for="radioMale">男</label>
              </div>
              <div class="form-check mr-3 col-sm-1 col-2">
                <input name="groupSex" type="radio" id="radioFemale" class="form-check-input" (click)="changeSex('女')">
                <label class="form-check-label" for="radioFemale">女</label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <strong>3. 聯絡電話</strong>
            <input type="text"
                   name="formHomePhone"
                   class="form-control"
                   required [(ngModel)]="formPhone">
          </div>
          <div class="form-group">
            <strong>4. MAIL</strong>
            <input type="email"
                   name="formMail"
                   class="form-control"
                   required [(ngModel)]="formMail">
          </div>
          <div class="form-group">
            <strong>5. 與台灣炫光藝術協會的關係</strong>
            <div class="form-check">
              <input class="form-check-input" name="groupRelation"
                     type="radio" id="radioArt" (click)="changeRelation('藝術家(炫小子)')">
              <label class="form-check-label" for="radioArt">藝術家(炫小子)</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" name="groupRelation"
                     type="radio" id="radioMember" (click)="changeRelation('會員')">
              <label class="form-check-label" for="radioMember">會員</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" name="groupRelation"
                     type="radio" id="radioVolunteer" (click)="changeRelation('志工')">
              <label class="form-check-label" for="radioVolunteer">志工</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" name="groupRelation"
                     type="radio" id="radioStaff" (click)="changeRelation('工作人員')">
              <label class="form-check-label" for="radioStaff">工作人員</label>
            </div>
            <div class="form-check form-inline">
              <input class="form-check-input" name="groupRelation"
                     type="radio" id="radioOthers" (click)="changeRelation('其他')">
              <label class="form-check-label mr-3" for="radioOthers">其他</label>
              <input type="text" name="formRelation" class="form-control" [(ngModel)]="formRelationOthers">
            </div>
          </div>
          <ng-container *ngIf="this.event.enableForm === true; else enableFormElseBlock">
            <p class="float-right"><input type="submit" class="btn btn-dark" value="提交" (click)="submit()"></p>
          </ng-container>
          <ng-template #enableFormElseBlock>
            <p class="float-right"><input type="submit" class="btn btn-dark" disabled value="報名已截止"></p>
          </ng-template>
        </div>
      </div>
    </div>
  `
})
export class PageSchoolCalendarDetailFormComponent implements OnInit, OnDestroy {
  private _id: string;
  private eventSubscription;
  private routerSubscription;
  event = new EventModel('', '');
  formName = '';
  formSex = '';
  formPhone = '';
  formMail = '';
  formRelation = '';
  formRelationOthers = '';

  @Input()
  set id(id: string) {
    this._id = id;
    this.eventSubscription = this.database.object('school/calendar/' + id).snapshotChanges()
      .subscribe(results => {
        this.event = new EventModel(results.payload.val(), results.key);
      });
  }
  get id() {
    return this._id;
  }
  constructor(private database: AngularFireDatabase, private route: ActivatedRoute, private toastService: ToastService) {}

  ngOnInit() {
    this.routerSubscription = this.route
      .params
      .subscribe(param => {
        this.id = String(+param['id']);
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.eventSubscription.unsubscribe();
  }
  changeSex(sex: string) {
    this.formSex = sex;
  }
  changeRelation(relation: string) {
    this.formRelation = relation;
  }
  submit() {
    if (this.formName === '') {
      alert('請輸入姓名');
    } else if (this.formSex === '') {
      alert('請選擇性別');
    } else if (this.formPhone === '') {
      alert('請輸入聯絡電話');
    } else if (this.formMail === '') {
      alert('請輸入 Email');
    } else if (this.formRelation === '') {
      alert('請選擇與台灣炫光藝術協會的關係');
    } else if (this.formRelation === '其他' && this.formRelationOthers === '') {
      alert('請輸入其他關係的內容');
    } else {
      if (this.formRelation === '其他') {
        this.formRelation = '其他_' + this.formRelationOthers;
      }
      const date = Date();
      this.database.list('school/calendar/form/' + this.event.key)
        .push({
          name: this.formName,
          sex: this.formSex,
          phone: this.formPhone,
          email: this.formMail,
          relation: this.formRelation,
          createdAt: date,
        })
        .then(_ => {
          const html = `<div>報名活動: ${this.event.title}_${this.event.subTitle}</div>
<div>姓名: ${this.formName}</div><div>性別: ${this.formSex}</div>
<div>聯絡電話: ${this.formPhone}</div><div>Email: <a href="mailto:${this.formMail}">${this.formMail}</a></div>
<div>與台灣炫光藝術協會的關係: ${this.formRelation}</div><div>表單送出時間: ${date}</div>`;
          this.database.list('sendBox')
            .push({
              title: '報名炫光小學堂活動_' + this.event.title + '_' + this.formName,
              html: html,
              date: date
            })
            .then( results => {
              this.formName = '';
              this.formPhone = '';
              this.formMail = '';
              this.formRelationOthers = '';
              this.toastService.success('表單送出成功！');
            }, results => {
              this.toastService.error('表單送出失敗，請稍候再試。');
            });
        }, results => {
          this.toastService.error('表單送出失敗，請稍候再試。');
        });
    }
  }
}
