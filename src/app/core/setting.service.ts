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
        'zh' : '炫小子',
      },
      donation : {
        'en' : 'Join/Support',
        'zh' : '加入支持',
      },
      application: {
        'en' : 'Application',
        'zh' : '報名本屆炫光'
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
