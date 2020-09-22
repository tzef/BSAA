import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {HistoryModel} from '../model/history.model';
import {SettingService} from '../core/setting.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormPlanModel } from '../model/formplan.model';


@Component({
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <app-page-title-component title="2020 報名資料" topImage=false></app-page-title-component>
        </div>
      </div>
    </div>
    <ng-container *ngFor="let history of historyList">
      <div class="container">
        <div class="row">
          <ng-container *ngIf="history.fileUrl != 'fileUploading'; else fileUrlElse">
            <div class="col-md-4 col-sm-6">
              <a href="{{ history.fileUrl }}" target = "_blank">
                <app-image-ratio-component image="{{ history.fileUrl }}" ratio="1:1">
                </app-image-ratio-component>
              </a>
            </div>
            <div class="col-md-3 col-sm-6">
              <a href="{{ history.avatarUrl }}" target = "_blank">
                <app-image-ratio-component image="{{ history.avatarUrl }}" ratio="1:1">
                </app-image-ratio-component>
              </a>
              <h4>{{ history.name }}</h4>
              {{ history.school }}<br>
              {{ history.age }}<br>
              {{ history.address }}<br>
              {{ history.cellPhone }}<br>
              {{ history.homePhone }}<br>
              {{ history.email }}<br>
            </div>
            <div class="col-md-5 col-sm-12">
              <h2>{{ history.productName }}</h2>
              媒材/尺寸: {{ history.productMaterial }}/{{ history.productSize }}<br>
              <hr>
              {{ history.introduce }}<br>
              <hr>
              {{ history.dream }}<br>
              <hr>
              <div *ngFor="let text of history.createConcept|stringNewLine">
                {{ text }}<br>
              </div>
              <hr>
              <em>{{ history.videoUrl }}</em><br>
              <strong>{{ history.createdAt }}</strong>
            </div>
          </ng-container>
          <ng-template #fileUrlElse>
            <div class="col-md-3 col-sm-6">
              <a href="{{ history.avatarUrl }}" target = "_blank">
                <app-image-ratio-component image="{{ history.avatarUrl }}" ratio="1:1">
                </app-image-ratio-component>
              </a>
              <h4>{{ history.name }}</h4>
              {{ history.school }}<br>
              {{ history.age }}<br>
              {{ history.address }}<br>
              {{ history.cellPhone }}<br>
              {{ history.homePhone }}<br>
              {{ history.email }}<br>
            </div>
            <div class="col-md-9 col-sm-12">
              <h2>{{ history.productName }}</h2>
              媒材/尺寸: {{ history.productMaterial }}/{{ history.productSize }}<br>
              <hr>
              {{ history.introduce }}<br>
              <hr>
              {{ history.dream }}<br>
              <hr>
              <div *ngFor="let text of history.createConcept|stringNewLine">
                {{ text }}<br>
              </div>
              <hr>
              <em>{{ history.videoUrl }}</em><br>
              <strong>{{ history.createdAt }}</strong>
            </div>
          </ng-template>
        </div>
      </div>
      <app-separate-right-component></app-separate-right-component>
    </ng-container>
  `
})
export class AdministratorPage2020Component implements OnInit, OnDestroy {
  historySubscription: Subscription;
  historyList: FormPlanModel[];
  languageCode: string;
  langSubscription;
  menuMap;

  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.langSubscription = this.settingService.langCode$
      .subscribe(lang => {
        this.languageCode = lang;
        this.getInfo();
      });
    this.menuMap = this.settingService.menuMap;
  }
  ngOnInit() {
  }
  ngOnDestroy () {
    this.langSubscription.unsubscribe();
    this.historySubscription.unsubscribe();
  }
  getInfo() {
    if (this.historySubscription) {
      this.historySubscription.unsubscribe();
    }
    this.historySubscription = this.database
      .list('plan/form/2020', ref => ref.orderByChild('date'))
      .snapshotChanges()
      .pipe(map(action => {
        return action.map(json => new FormPlanModel(json.payload.val(), json.key));
      }))
      .subscribe(results => {
        this.historyList = results.reverse();
      });
  }
}
