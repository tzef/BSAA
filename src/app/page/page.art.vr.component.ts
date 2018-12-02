import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {SettingService} from '../core/setting.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  template: `
    <div class="container">
      <app-page-title-component title="VR 藝廊" topImage=false></app-page-title-component>
      <div class="embed-responsive embed-responsive-21by9">
        <iframe class="embed-responsive-item" src="https://player.vimeo.com/video/137857207"></iframe>
      </div>
      <div class="mt-5">
        <div *ngFor="let text of description|async|stringNewLine">
          {{ text }}<br>
        </div>
      </div>
    </div>
  `
})
export class PageArtVrComponent {
  description: Observable<string>;
  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.description = this.database.object('art/vr')
      .snapshotChanges()
      .pipe(
        map(value => value.payload.val()['description'])
      );
  }
}
