import {CanActivate} from '@angular/router';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AngularFireAuth) private authService: AngularFireAuth) {
  }
  canActivate(): Observable<boolean> {
    return this.authService.authState.pipe(map(user => {
      return user !== null;
    }));
  }
}
