import {BehaviorSubject, Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {User} from 'firebase';
import {share} from 'rxjs/operators';

@Injectable()
export class SettingService {
  path$: BehaviorSubject<string>;
  authState$: Observable<User>;
  languageCode = 'zh';
  menuMap: any;
  constructor(@Inject(AngularFireAuth) private authService: AngularFireAuth) {
    this.authState$ = this.authService.authState.pipe(share());
    this.path$ = new BehaviorSubject<string>('')
    this.menuMap = {
      about : {
        'en' : 'About',
        'zh' : '關於協會',
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
