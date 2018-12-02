import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ArtistModel} from '../model/artist.model';
import {Component, OnDestroy} from '@angular/core';
import {SettingService} from '../core/setting.service';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  template: `
    <div class="container">
      <app-page-title-component title="大藝術家" topImage=false></app-page-title-component>
      <div class="row no-gutters">
        <ng-container *ngFor="let artist of artistList">
          <div class="col-md-2 col-sm-4 col-6 mt-4">
            <a routerLink="/database/artist/{{artist.key}}">
              <app-image-ratio-component image="{{ artist.imgUrl }}" ratio="1:1">
              </app-image-ratio-component>
            </a>
            <p style="text-align: center">{{ artist.name }}</p>
          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class PageDatabaseArtistComponent implements OnDestroy {
  artistSubscription: Subscription;
  artistList: ArtistModel[];
  constructor(private database: AngularFireDatabase,
              private storage: AngularFireStorage,
              private settingService: SettingService,
              private router: Router) {
    this.settingService.path$.next(this.router.url);
    this.getInfo();
  }
  ngOnDestroy () {
    if (this.artistSubscription) {
      this.artistSubscription.unsubscribe();
    }
  }
  getInfo() {
    if (this.artistSubscription) {
      this.artistSubscription.unsubscribe();
    }
    this.artistSubscription = this.database
      .list('database/artist')
      .snapshotChanges()
      .pipe(map(action => {
        return action.map(json => new ArtistModel(json.payload.val(), json.key));
      }))
      .subscribe(results => {
        this.artistList = results;
      });
  }
}
