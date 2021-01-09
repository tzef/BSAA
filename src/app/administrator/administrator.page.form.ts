import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {HistoryModel} from '../model/history.model';
import {SettingService} from '../core/setting.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormPlanModel } from '../model/formplan.model';


@Component({
  template: `
    <ng-container *ngIf="this.path === 'plan/form/'; else isPlanFormElseBlock">
      <div class="container">
        <div class="row">
          <div class="col">
            <app-page-title-component title="{{ _id }} 炫光計劃報名資料" topImage=false></app-page-title-component>
          </div>
        </div>
      </div>
      <ng-container *ngFor="let event of eventList">
        <div class="container">
          <div class="row">
            <ng-container *ngIf="event.fileUrl != 'fileUploading'; else fileUrlElse">
              <div class="col-md-4 col-sm-6">
                <a href="{{ event.fileUrl }}" target = "_blank">
                  <app-image-ratio-component image="{{ event.fileUrl }}" ratio="1:1">
                  </app-image-ratio-component>
                </a>
              </div>
              <div class="col-md-3 col-sm-6">
                <a href="{{ event.avatarUrl }}" target = "_blank">
                  <app-image-ratio-component image="{{ event.avatarUrl }}" ratio="1:1">
                  </app-image-ratio-component>
                </a>
                <h4>{{ event.name }}</h4>
                {{ event.school }}<br>
                {{ event.age }}<br>
                {{ event.address }}<br>
                {{ event.cellPhone }}<br>
                {{ event.homePhone }}<br>
                {{ event.email }}<br>
              </div>
              <div class="col-md-5 col-sm-12">
                <h2>{{ event.productName }}</h2>
                媒材/尺寸: {{ event.productMaterial }}/{{ event.productSize }}<br>
                <hr>
                {{ event.introduce }}<br>
                <hr>
                {{ event.dream }}<br>
                <hr>
                <div *ngFor="let text of event.createConcept|stringNewLine">
                  {{ text }}<br>
                </div>
                <hr>
                <em>{{ event.videoUrl }}</em><br>
                <strong>{{ event.createdAt }}</strong>
              </div>
            </ng-container>
            <ng-template #fileUrlElse>
              <div class="col-md-3 col-sm-6">
                <a href="{{ event.avatarUrl }}" target = "_blank">
                  <app-image-ratio-component image="{{ event.avatarUrl }}" ratio="1:1">
                  </app-image-ratio-component>
                </a>
                <h4>{{ event.name }}</h4>
                {{ event.school }}<br>
                {{ event.age }}<br>
                {{ event.address }}<br>
                {{ event.cellPhone }}<br>
                {{ event.homePhone }}<br>
                {{ event.email }}<br>
              </div>
              <div class="col-md-9 col-sm-12">
                <h2>{{ event.productName }}</h2>
                媒材/尺寸: {{ event.productMaterial }}/{{ event.productSize }}<br>
                <hr>
                {{ event.introduce }}<br>
                <hr>
                {{ event.dream }}<br>
                <hr>
                <div *ngFor="let text of event.createConcept|stringNewLine">
                  {{ text }}<br>
                </div>
                <hr>
                <em>{{ event.videoUrl }}</em><br>
                <strong>{{ event.createdAt }}</strong>
              </div>
            </ng-template>
          </div>
        </div>
        <app-separate-right-component></app-separate-right-component>
      </ng-container>
    </ng-container>
    <ng-template #isPlanFormElseBlock>
      <div class="container">
        <div class="row">
          <div class="col">
            <app-page-title-component title="活動 {{ _id }} 報名資料" topImage=false></app-page-title-component>
          </div>
        </div>
      </div>
      <ng-container *ngFor="let event of eventList">
        <div class="container">
            <h2>{{ event.name }}</h2>
            姓別: {{ event.sex }}<br>
            <hr>
            Email: {{ event.email }}<br>
            <hr>
            電話: {{ event.phone }}<br>
            <hr>
            與協會的關係: {{ event.relation }}<br>
            <hr>
            何處得知炫光計劃： {{ event.whereKnowUs }}<br>
            <hr>
            <strong>{{ event.createdAt }}</strong>
          </div>
        <app-separate-right-component></app-separate-right-component>
      </ng-container>
    </ng-template>
  `
})
export class AdministratorPageFormComponent implements OnInit, OnDestroy {
  _id: string;
  routerSubscription;
  eventSubscription: Subscription;
  eventList: FormPlanModel[];
  languageCode: string;
  langSubscription;
  menuMap;
  path;

  @Input()
  set id(id: string) {
    this._id = id;
    if (parseInt(id, 10) < 1000) {
      this.path = 'school/calendar/form/';
    } else {
      this.path = 'plan/form/';
    }
    this.eventSubscription = this.database
      .list(this.path + id, ref => ref.orderByChild('date'))
      .snapshotChanges()
      .pipe(map(action => {
        return action.map(json => new FormPlanModel(json.payload.val(), json.key));
      }))
      .subscribe(results => {
        this.eventList = results.reverse();
      });
  }
  get id() {
    return this._id;
  }

  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router,
              private route: ActivatedRoute) {
    this.settingService.path$.next(this.router.url);
    this.langSubscription = this.settingService.langCode$
      .subscribe(lang => {
        this.languageCode = lang;
      });
    this.menuMap = this.settingService.menuMap;
  }
  ngOnInit() {
    this.routerSubscription = this.route
      .params
      .subscribe(param => {
        this.id = String(+param['id']);
      });
  }
  ngOnDestroy () {
    this.langSubscription.unsubscribe();
    this.eventSubscription.unsubscribe();
  }
}
