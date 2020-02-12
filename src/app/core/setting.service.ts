import {AngularFireAuth} from 'angularfire2/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {share} from 'rxjs/operators';
import {User} from 'firebase';

@Injectable()
export class SettingService {
  langCode$: BehaviorSubject<string>;
  path$: BehaviorSubject<string>;
  authState$: Observable<User>;
  menuMap: any;
  constructor(@Inject(AngularFireAuth) private authService: AngularFireAuth) {
    this.authState$ = this.authService.authState.pipe(share());
    this.langCode$ = new BehaviorSubject<string>('zh');
    this.path$ = new BehaviorSubject<string>('')
    this.menuMap = {
      about : {
        'en' : 'About',
        'zh' : '關於協會',
      },
      plan : {
        'en' : 'Bright Star Project',
        'zh' : '炫光計畫',
      },
      planOrigin : {
        'en' : 'Origin',
        'zh' : '炫光緣起',
      },
      planCurrent : {
        'en' : 'Current Edition',
        'zh' : '本屆炫光',
      },
      planHistory : {
        'en' : 'Past Editions',
        'zh' : '歷屆炫光',
      },
      school : {
        'en' : 'Bright Star Classroom',
        'zh' : '炫光小學堂',
      },
      schoolCalendar : {
        'en' : 'Upcoming Event',
        'zh' : '活動預告',
      },
      schoolGallery : {
        'en' : 'Sidelights',
        'zh' : '歷屆花絮',
      },
      art : {
        'en' : 'Performance Stage',
        'zh' : '炫藝場',
      },
      artUpcoming : {
        'en' : 'Upcoming Event',
        'zh' : '活動預告',
      },
      artVR : {
        'en' : 'VR藝廊_En',
        'zh' : 'VR藝廊',
      },
      database : {
        'en' : 'Artist',
        'zh' : '藝術家',
      },
      databaseArtist: {
        'en' : 'Senior Artists',
        'zh' : '資深藝術家',
      },
      databaseCoolGuy: {
        'en' : 'Emerging Artists',
        'zh' : '極炫/光 (歷屆得獎者)',
      },
      donation : {
        'en' : 'Join/Support',
        'zh' : '加入支持',
      },
      application: {
        'en' : 'Application',
        'zh' : '報名本屆炫光'
      },
      support_recruitment: {
        'en' : 'Volunteer Recruitment',
        'zh' : '招募計畫'
      },
      support_apply: {
        'en' : 'Apply For BV',
        'zh' : '報名炫志工'
      },
      support_application: {
        'en' : 'Application for Adult Volunteer',
        'zh' : '成人志工申請表'
      },
      support_name: {
        'en' : 'Applicant Name',
        'zh' : '申請人姓名'
      },
      support_mr: {
        'en' : 'Mr',
        'zh' : '先生'
      },
      support_ms: {
        'en' : 'Ms',
        'zh' : '小姐'
      },
      support_homeTel: {
        'en' : 'Tel (Home)',
        'zh' : '住家電話'
      },
      support_mobile: {
        'en' : 'Mobile Phone',
        'zh' : '行動電話'
      },
      support_officeTel: {
        'en' : 'Tel (Office)',
        'zh' : '公司電話'
      },
      support_email: {
        'en' : 'E-mail',
        'zh' : '電子郵件'
      },
      support_address: {
        'en' : 'Address',
        'zh' : '地址'
      },
      support_education: {
        'en' : 'Education Background',
        'zh' : '學歷'
      },
      support_phD: {
        'en' : 'PhD',
        'zh' : '博士'
      },
      support_master: {
        'en' : 'Master',
        'zh' : '碩士'
      },
      support_university: {
        'en' : 'University',
        'zh' : '大學'
      },
      support_college: {
        'en' : 'College',
        'zh' : '專科'
      },
      support_seniorHigh: {
        'en' : 'Senior High School',
        'zh' : '高中'
      },
      support_juniorHigh: {
        'en' : 'Junior High School',
        'zh' : '國中'
      },
      support_elementary: {
        'en' : 'Elementary School (or below)',
        'zh' : '國中以下'
      },
      support_secondLanguage: {
        'en' : 'Second Language(s)',
        'zh' : '外語能力'
      },
      support_english: {
        'en' : 'English',
        'zh' : '英語'
      },
      support_japances: {
        'en' : 'Japanese',
        'zh' : '日語'
      },
      support_affiliation: {
        'en' : 'Affiliation (pick one)',
        'zh' : '服務單位 (四選一)'
      },
      support_employed: {
        'en' : 'Employed',
        'zh' : '在職'
      },
      support_retired: {
        'en' : 'Retired',
        'zh' : '退休'
      },
      support_student: {
        'en' : 'Student',
        'zh' : '學生'
      },
      support_other: {
        'en' : 'Other',
        'zh' : '其他'
      },
      support_volunteerCertificate: {
        'en' : 'Volunteer Certificate',
        'zh' : '志工手冊'
      },
      support_yes: {
        'en' : 'Yes',
        'zh' : '有'
      },
      support_no: {
        'en' : 'No',
        'zh' : '無'
      },
      support_uploadHeadshot: {
        'en' : 'Upload a headshot (300KB)',
        'zh' : '上傳大頭照(300KB)'
      },
      confirm: {
        'en' : 'Confirm',
        'zh' : '確認送出'
      }
    };
  }
  logout() {
    this.authService.auth.signOut().then(results => {
      console.log('logout results ' + results);
    }, reason => {
      console.log('logout failed ' + reason);
    });
  }
}
