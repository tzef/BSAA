import {Component, Input, OnDestroy} from '@angular/core';
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
            <!--{{ languageCode | i18nSelect:menuMap.art }}-->
          <!--</a>-->
          <!--<div *dropdownMenu class="dropdown-menu dropdown dropdown-primary" role="menu">-->
            <!--<ng-container *ngIf="isAuth$|async; else artElseBlock">-->
              <!--<a class="dropdown-item waves-light" mdbWavesEffect routerLink="administrator/art/upcoming" routerLinkActive="active">-->
                <!--{{ languageCode | i18nSelect:menuMap.artUpcoming }}-->
              <!--</a>-->
              <!--<a class="dropdown-item waves-light" mdbWavesEffect routerLink="administrator/art/vr" routerLinkActive="active">-->
                <!--{{ languageCode | i18nSelect:menuMap.artVR }}-->
              <!--</a>-->
            <!--</ng-container>-->
            <!--<ng-template #artElseBlock>-->
              <!--<a class="dropdown-item waves-light" mdbWavesEffect routerLink="/art/upcoming" routerLinkActive="active">-->
                <!--{{ languageCode | i18nSelect:menuMap.artUpcoming }}-->
              <!--</a>-->
              <!--<a class="dropdown-item waves-light" mdbWavesEffect routerLink="/art/vr" routerLinkActive="active">-->
                <!--{{ languageCode | i18nSelect:menuMap.artVR }}-->
              <!--</a>-->
            <!--</ng-template>-->
          <!--</div>-->
        <!--</li>-->
          <li class="nav-item dropdown" dropdown *ngIf="isAuth$|async">
            <a dropdownToggle mdbWavesEffect type="button" class="nav-link dropdown-toggle waves-light" mdbWavesEffect>
              {{ languageCode | i18nSelect:menuMap.database }}
            </a>
            <div *dropdownMenu class="dropdown-menu dropdown dropdown-primary" role="menu">
              <!--<ng-container *ngIf="isAuth$|async; else databaseElseBlock">-->
                <a class="dropdown-item waves-light" mdbWavesEffect routerLink="administrator/database/artist" routerLinkActive="active">
                  {{ languageCode | i18nSelect:menuMap.databaseArtist }}
                </a>
                <a class="dropdown-item waves-light" mdbWavesEffect routerLink="administrator/database/coolguy" routerLinkActive="active">
                  {{ languageCode | i18nSelect:menuMap.databaseCoolGuy }}
                </a>
              <!--</ng-container>-->
              <!--<ng-template #databaseElseBlock>-->
                <!--<a class="dropdown-item waves-light" mdbWavesEffect routerLink="/database/artist" routerLinkActive="active">-->
                  <!--{{ languageCode | i18nSelect:menuMap.databaseArtist }}-->
                <!--</a>-->
                <!--<a class="dropdown-item waves-light" mdbWavesEffect routerLink="/database/coolguy" routerLinkActive="active">-->
                  <!--{{ languageCode | i18nSelect:menuMap.databaseCoolGuy }}-->
                <!--</a>-->
              <!--</ng-template>-->
            </div>
          </li>
          <ng-container *ngIf="isAuth$|async; else donationElseBlock">
            <li class="nav-item waves-light" [ngClass]="highLightMenu == 'administrator/support' ? 'active' : ''" mdbWavesEffect>
              <a class="nav-link" routerLink="administrator/support" routerLinkActive="active">
                {{ languageCode | i18nSelect:menuMap.donation }}
                <span class="sr-only">(current)</span></a>
            </li>
          </ng-container>
          <ng-template #donationElseBlock>
            <li class="nav-item waves-light" [ngClass]="highLightMenu == '/support' ? 'active' : ''" mdbWavesEffect>
              <a class="nav-link" routerLink="/support" routerLinkActive="active">
                {{ languageCode | i18nSelect:menuMap.donation }}
                <span class="sr-only">(current)</span></a>
            </li>
          </ng-template>
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
