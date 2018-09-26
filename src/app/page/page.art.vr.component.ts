import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {SettingService} from '../core/setting.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  template: `
    <div class="row">
      <div class="col-1"></div>
      <div class="col-10">
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
      <div class="col-1"></div>
    </div>
    <div class="container" style="position: absolute">
      <div class="row">
        <div class="col-1"></div>
        <div class="float-left" (click)="form.show()">
          <a class="btn-floating btn-small btn-default waves-light" mdbWavesEffect>
            <i class="fa fa-edit"> </i>
          </a>
        </div>
      </div>
    </div>
    <div mdbModal #form="mdb-modal" class="modal fade" tabindex="-1" role="dialog" style="overflow: auto;">
      <div class="modal-dialog cascading-modal" role="document">
        <div class="modal-content">
          <div class="modal-header light-blue darken-3 white-text">
            <h4 class="title"><i class="fa fa-pencil"></i> VR 藝廊 內容編輯 </h4>
            <button id="form-edit-close-btn" type="button" class="close waves-effect waves-light" data-dismiss="modal"
                    (click)="form.hide()">
              <span>×</span>
            </button>
          </div>
          <div class="modal-body mb-0">
            <div class="md-form form-sm">
                <textarea #content mdbInputDirective type="text"
                          class="md-textarea form-control" rows="10" value="{{ description | async }}"></textarea>
            </div>
          </div>
          <div class="text-center mt-1-half">
            <button class="btn btn-info mb-2 waves-light" mdbWavesEffect (click)="update(content.value)">
              更新 <i class="fa fa-save ml-1"></i>
            </button>
          </div>
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
  update(text: string) {
    this.database.object('art/vr')
      .set({ description: text })
      .then(_ => {
        (document.getElementById('form-edit-close-btn') as HTMLElement).click();
      });
  }
}
