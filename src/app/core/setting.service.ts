import {BehaviorSubject, Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {User} from 'firebase';
import {share} from 'rxjs/operators';

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
        'en' : 'Plan',
        'zh' : '炫光計畫',
      },
      planOrigin : {
        'en' : 'Origin',
        'zh' : '炫光緣起',
      },
      planCurrent : {
        'en' : 'Current',
        'zh' : '本屆炫光',
      },
      planHistory : {
        'en' : 'History',
        'zh' : '歷屆炫光',
      },
      school : {
        'en' : 'School',
        'zh' : '炫光小學堂',
      },
      schoolCalendar : {
        'en' : 'Calendar',
        'zh' : '活動預告',
      },
      schoolGallery : {
        'en' : 'Gallery',
        'zh' : '歷屆花絮',
      },
      donation : {
        'en' : 'Support',
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
