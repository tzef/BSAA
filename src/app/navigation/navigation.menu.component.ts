import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SettingService} from '../core/setting.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-menu-component',
  template: `
    <mdb-navbar SideClass="navbar navbar-expand-lg navbar-dark scrolling-navbar ie-nav {{ color }}"
                data-spy="affix" data-offset-top="17" [containerInside]="true">
      <links>
        <ul class="navbar-nav mr-auto">
          <ng-container *ngIf="isAuth$|async; else aboutElseBlock">
            <li class="nav-item waves-light" [ngClass]="highLightMenu == 'administrator/about' ? 'active' : ''" mdbWavesEffect>
              <a class="nav-link" routerLink="administrator/about" routerLinkActive="active">
                {{ languageCode | i18nSelect:menuMap.about }}
                <span class="sr-only">(current)</span></a>
            </li>
          </ng-container>
          <ng-template #aboutElseBlock>
            <li class="nav-item waves-light" [ngClass]="highLightMenu == '/about' ? 'active' : ''" mdbWavesEffect>
              <a class="nav-link" routerLink="/about" routerLinkActive="active">
                {{ languageCode | i18nSelect:menuMap.about }}
                <span class="sr-only">(current)</span></a>
            </li>
          </ng-template>
          <li class="nav-item dropdown" dropdown>
            <a dropdownToggle mdbWavesEffect type="button" class="nav-link dropdown-toggle waves-light" mdbWavesEffect>
              {{ languageCode | i18nSelect:menuMap.plan }}
            </a>
            <div *dropdownMenu class="dropdown-menu dropdown dropdown-primary" role="menu">
              <ng-container *ngIf="isAuth$|async; else planElseBlock">
                <a class="dropdown-item waves-light" mdbWavesEffect routerLink="administrator/plan/origin" routerLinkActive="active">
                  {{ languageCode | i18nSelect:menuMap.planOrigin }}
                </a>
                <a class="dropdown-item waves-light" mdbWavesEffect routerLink="administrator/plan/current" routerLinkActive="active">
                  {{ languageCode | i18nSelect:menuMap.planCurrent }}
                </a>
                <a class="dropdown-item waves-light" mdbWavesEffect routerLink="administrator/plan/history" routerLinkActive="active">
                  {{ languageCode | i18nSelect:menuMap.planHistory }}
                </a>
              </ng-container>
              <ng-template #planElseBlock>
                <a class="dropdown-item waves-light" mdbWavesEffect routerLink="plan/origin" routerLinkActive="active">
                  {{ languageCode | i18nSelect:menuMap.planOrigin }}
                </a>
                <a class="dropdown-item waves-light" mdbWavesEffect routerLink="plan/current" routerLinkActive="active">
                  {{ languageCode | i18nSelect:menuMap.planCurrent }}
                </a>
                <a class="dropdown-item waves-light" mdbWavesEffect routerLink="plan/history" routerLinkActive="active">
                  {{ languageCode | i18nSelect:menuMap.planHistory }}
                </a>
              </ng-template>
            </div>
          </li>
          <li class="nav-item dropdown" dropdown>
            <a dropdownToggle mdbWavesEffect type="button" class="nav-link dropdown-toggle waves-light" mdbWavesEffect>
              {{ languageCode | i18nSelect:menuMap.school }}
            </a>
            <div *dropdownMenu class="dropdown-menu dropdown dropdown-primary" role="menu">
              <ng-container *ngIf="isAuth$|async; else schoolElseBlock">
                <a class="dropdown-item waves-light" mdbWavesEffect routerLink="administrator/school/calendar" routerLinkActive="active">
                  {{ languageCode | i18nSelect:menuMap.schoolCalendar }}
                </a>
                <a class="dropdown-item waves-light" mdbWavesEffect routerLink="administrator/school/gallery" routerLinkActive="active">
                  {{ languageCode | i18nSelect:menuMap.schoolGallery }}
                </a>
              </ng-container>
              <ng-template #schoolElseBlock>
                <a class="dropdown-item waves-light" mdbWavesEffect routerLink="school/calendar" routerLinkActive="active">
                  {{ languageCode | i18nSelect:menuMap.schoolCalendar }}
                </a>
                <a class="dropdown-item waves-light" mdbWavesEffect routerLink="school/gallery" routerLinkActive="active">
                  {{ languageCode | i18nSelect:menuMap.schoolGallery }}
                </a>
              </ng-template>
            </div>
          </li>
          <!--<li class="nav-item dropdown" dropdown>-->
            <!--<a dropdownToggle mdbWavesEffect type="button" class="nav-link dropdown-toggle waves-light" mdbWavesEffect>-->
              <!--炫藝場-->
            <!--</a>-->
            <!--<div *dropdownMenu class="dropdown-menu dropdown dropdown-primary" role="menu">-->
              <!--<a class="dropdown-item waves-light" mdbWavesEffect routerLink="/art/upcoming" routerLinkActive="active">活動預告</a>-->
              <!--<a class="dropdown-item waves-light" mdbWavesEffect routerLink="/art/vr" routerLinkActive="active">VR藝廊</a>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li class="nav-item dropdown" dropdown>-->
            <!--<a dropdownToggle mdbWavesEffect type="button" class="nav-link dropdown-toggle waves-light" mdbWavesEffect>-->
              <!--藝術家資料庫-->
            <!--</a>-->
            <!--<div *dropdownMenu class="dropdown-menu dropdown dropdown-primary" role="menu">-->
              <!--<a class="dropdown-item waves-light" mdbWavesEffect routerLink="/database/artist" routerLinkActive="active">大藝術家</a>-->
              <!--<a class="dropdown-item waves-light" mdbWavesEffect routerLink="/database/coolguy" routerLinkActive="active">炫小子</a>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li class="nav-item waves-light" [ngClass]="highLightMenu == '/donation' ? 'active' : ''" mdbWavesEffect>-->
            <!--<a class="nav-link" routerLink="/donation" routerLinkActive="active">贊助炫光</a>-->
          <!--</li>-->
        </ul>
      </links>
    </mdb-navbar>
  `
})
export class NavigationMenuComponent implements OnDestroy {
  @Input() color: string;
  highLightMenu = '/about';
  languageCode: string;
  pathSubscription;
  langSubscription;
  isAuth$;
  menuMap;

  constructor(private settingService: SettingService) {
    this.langSubscription = this.settingService.langCode$
      .subscribe(lang => {
        this.languageCode = lang;
      });
    this.pathSubscription = this.settingService.path$
      .subscribe(url => {
        this.highLightMenu = url;
      });
    this.isAuth$ = this.settingService.authState$.pipe(map(user => {
      return user !== null;
    }));
    this.menuMap = this.settingService.menuMap;
  }
  ngOnDestroy() {
    this.pathSubscription.unsubscribe();
    this.langSubscription.unsubscribe();
  }
}
