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
        'en' : '炫光計畫_En',
        'zh' : '炫光計畫',
      },
      planOrigin : {
        'en' : 'Origin',
        'zh' : '炫光緣起',
      },
      planCurrent : {
        'en' : '本屆炫光_En',
        'zh' : '本屆炫光',
      },
      planHistory : {
        'en' : '本屆炫光_En',
        'zh' : '本屆炫光',
      },
      school : {
        'en' : '炫光小學堂_En',
        'zh' : '炫光小學堂',
      },
      schoolCalendar : {
        'en' : '活動預告_En',
        'zh' : '活動預告',
      },
      schoolGallery : {
        'en' : '歷屆花絮_En',
        'zh' : '歷屆花絮',
      },
      art : {
        'en' : '炫藝場_En',
        'zh' : '炫藝場',
      },
      artUpcoming : {
        'en' : '活動預告_En',
        'zh' : '活動預告',
      },
      artVR : {
        'en' : 'VR藝廊_En',
        'zh' : 'VR藝廊',
      },
      database : {
        'en' : '藝術家資料庫_En',
        'zh' : '藝術家資料庫',
      },
      databaseArtist: {
        'en' : '大藝術家_En',
        'zh' : '大藝術家',
      },
      databaseCoolGuy: {
        'en' : '炫小子_En',
        'zh' : '炫小子',
      },
      donation : {
        'en' : '加入支持_En',
        'zh' : '加入支持',
      },
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
