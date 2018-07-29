import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, Inject, OnDestroy} from '@angular/core';
import {SettingService} from '../core/setting.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';


@Component({
  template: `
    <div class="modal-dialog" role="document" *ngIf="isLoggedIn === false">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h4 class="modal-title w-100 font-weight-bold">Sign in</h4>
        </div>
        <form (ngSubmit)="submit()" [formGroup]="formGroup">
          <div class="modal-body mx-3">
            <div class="md-form mb-5">
              <i class="fa fa-envelope prefix grey-text"></i>
              <input type="email" formControlName="email" placeholder="Email"
                     class="form-control validate" mdbInputDirective>
              <div *ngIf="formGroup.get('email').hasError('required')">
                <p class="text-right" style="font-size: 12px">
                  Email 欄位不得為空
                </p>
              </div>
              <div *ngIf="formGroup.get('email').hasError('email')">
                <p class="text-right" style="font-size: 12px">
                  Email 格式錯誤
                <p></p>
              </div>
            </div>
            <div class="md-form mb-4">
              <i class="fa fa-lock prefix grey-text"></i>
              <input type="password" id="defaultForm-pass" formControlName="password" placeholder="Password"
                     class="form-control validate" mdbInputDirective>
              <div *ngIf="formGroup.get('password').errors">
                <p class="text-right" style="font-size: 12px">
                  密碼欄位不得為空
                </p>
              </div>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-center">
            <button type="submit" class="btn btn-default waves-light"
                    [ngClass]="formGroup.valid ? '' : 'disabled'"
                    mdbWavesEffect>Login</button>
          </div>
        </form>
      </div>
    </div>
    <div class="modal-dialog" role="document" *ngIf="isLoggedIn === true">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h4 class="modal-title w-100 font-weight-bold">管理者已登入</h4>
        </div>
        <div class="modal-footer d-flex justify-content-center">
          <button class="btn btn-default waves-light" (click)="logout()"
                  mdbWavesEffect>LOG OUT</button>
        </div>
      </div>
    </div>
  `
})
export class AdministratorLoginComponent implements OnDestroy {
  formGroup: FormGroup;
  authSubscription;
  isLoggedIn;
  constructor(@Inject(AngularFireAuth) private authService: AngularFireAuth, private formBuilder: FormBuilder,
              private router: Router, private settingService: SettingService) {
    this.authSubscription = this.settingService.authState$.subscribe(user => {
      this.isLoggedIn = (user !== null);
    });
    this.formGroup = this.formBuilder.group({
      email : [null, [Validators.email, Validators.required]],
      password : [null, Validators.required]
    });
  }
  logout() {
    this.settingService.logout();
    this.router.navigate(['/about'])
  }
  submit() {
    this.authService.auth
      .signInWithEmailAndPassword(this.formGroup.value['email'], this.formGroup.value['password'])
      .then(results => {
        alert('登入成功');
        this.router.navigate(['administrator/about'])
        console.log(results);
      }, reason => {
        alert('帳號密碼錯誤');
        console.log(reason);
      });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
