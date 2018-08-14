import {Router} from '@angular/router';
import {Component, OnDestroy} from '@angular/core';
import {SettingService} from '../core/setting.service';

@Component({
  selector: 'app-header-component',
  template: `
    <div class="row align-items-center">
      <div class="col-1">
        <ng-container *ngIf="isLoggedIn; else logoElseBlock">
          <a routerLink="administrator/about" routerLinkActive="active">
            <img class="logo" style="height: 100px; margin: 10px" src="/assets/logo.png"/>
          </a>
        </ng-container>
        <ng-template #logoElseBlock>
          <a routerLink="/about" routerLinkActive="active">
            <img class="logo" style="height: 100px; margin: 10px" src="/assets/logo.png"/>
          </a>
        </ng-template>
      </div>
      <div class="col">
        <ng-container *ngIf="isLoggedIn">
          <p class="text-left">管理者狀態<span style="font-size: 12px">(資料登打完畢記得登出)</span><a style="color: red" (click)="logout()"> [登出] </a></p>
        </ng-container>
      </div>
      <!--<div class="col-auto align-self-center mb-2 d-none d-sm-block">-->
        <!--<ng-container *ngIf="languageCode === 'zh'; else languageElseBlock1">-->
          <!--<a (click)="changedLangToChinese()">中文</a> | <a style="color: lightgray" (click)="changedLangToEnglish()">English</a>-->
        <!--</ng-container>-->
        <!--<ng-template #languageElseBlock1>-->
          <!--<a style="color: lightgray" (click)="changedLangToChinese()">中文</a> | <a (click)="changedLangToEnglish()">English</a>-->
        <!--</ng-template>-->
      <!--</div>-->
      <div class="col-auto align-self-center">
        <div class="text-center mb-3">
          <a class="btn-floating waves-light" mdbWavesEffect
             href="https://www.facebook.com/%E5%8F%B0%E7%81%A3%E7%82%AB%E5%85%89%E8%97%9D%E8%A1%93%E5%8D%94%E6%9C%83-338836259459978/"
             target="_blank">
            <img src="/assets/fb.png">
          </a>
          <a class="btn-floating waves-light" mdbWavesEffect
             href="https://www.instagram.com/brightstar_arts/" target="_blank">
            <img src="/assets/ig.png">
          </a>
          <a class="btn-floating waves-light" mdbWavesEffect
             href="https://www.youtube.com/channel/UCWj4Cm0BDiicehhRZyoQvHg" target="_blank">
            <img src="/assets/youtube.png">
          </a>
        </div>
        <!--<div class="text-center d-sm-none">-->
          <!--<ng-container *ngIf="languageCode === 'zh'; else languageElseBlock2">-->
            <!--<a (click)="changedLangToChinese()">中文</a> | <a style="color: lightgray" (click)="changedLangToEnglish()">English</a>-->
          <!--</ng-container>-->
          <!--<ng-template #languageElseBlock2>-->
            <!--<a style="color: lightgray" (click)="changedLangToChinese()">中文</a> | <a (click)="changedLangToEnglish()">English</a>-->
          <!--</ng-template>-->
        <!--</div>-->
      </div>
    </div>
  `,
  styles: [
    `
    `
  ]
})
export class NavigationHeaderComponent implements OnDestroy {
  languageCode: string;
  isLoggedIn = false;
  authSubscription;
  langSubscription;

  constructor(private settingService: SettingService, private router: Router) {
    this.authSubscription = this.settingService.authState$
      .subscribe(user => {
        this.isLoggedIn = (user !== null);
      });
    this.langSubscription = this.settingService.langCode$
      .subscribe(lang => {
        this.languageCode = lang;
      });
  }

  logout() {
    this.settingService.logout();
    this.router.navigate(['/about']);
  }

  changedLangToChinese() {
    this.settingService.langCode$.next('zh');
  }
  changedLangToEnglish() {
    this.settingService.langCode$.next('en');
  }
  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.langSubscription.unsubscribe();
  }
}
