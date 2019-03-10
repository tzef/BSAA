import {GridLayout, Image, PlainGalleryConfig, PlainGalleryStrategy} from 'angular-modal-gallery';
import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {SettingService} from '../core/setting.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GalleryModel} from '../model/gallery.model';
import {ImageModel} from '../model/image.model';
import {flatMap} from 'rxjs/operators';

@Component({
  template: `
    <div class="container">
      <div id="container">
        <app-page-title-component title="{{ languageCode | i18nSelect:menuMap.schoolGallery }} - {{ gallery.getTitle(this.languageCode) }}"
                                  topImage=false></app-page-title-component>
        <div class="mt-5">
          <ks-modal-gallery [modalImages]="galleryImages" [plainGalleryConfig]="plainGalleryGrid">
          </ks-modal-gallery>
        </div>
      </div>
    </div>
  `
})
export class PageSchoolGalleryDetailComponent implements OnInit, OnDestroy {
  private gallerySubscription;
  private routerSubscription;
  private _id: string;
  galleryImages: Image[] = [];
  inputImage: HTMLInputElement;
  gallery = new GalleryModel('', '');
  galleryPicWidth = window.screen.width * 0.8 / 6;
  plainGalleryGrid: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.GRID,
    layout: new GridLayout({ width: this.galleryPicWidth + 'px', height: this.galleryPicWidth + 'px' },
      { length: 6, wrap: true }),
    advanced: { aTags: true, additionalBackground: '50% 50%/cover' }
  };

  languageCode: string;
  langSubscription;
  menuMap;

  @Input()
  set id(id: string) {
    this._id = id;
    this.gallerySubscription = this.database.object('school/gallery/' + id).snapshotChanges().pipe(
      flatMap(results => {
        this.gallery = new GalleryModel(results.payload.val(), results.key);
        return this.database.list('school/gallery/' + id + '/imgList').snapshotChanges();
      }))
      .subscribe(results => {
        let serialNumber = 0;
        results.forEach(element => {
          this.gallery.imgList.push(new ImageModel(serialNumber, '', '', element.payload.val(), element.key));
          serialNumber += 1;
        });
        this.galleryImages = this.gallery.imgList.map(imageModel => {
          return new Image(imageModel.sort, {img: imageModel.url});
        });
        let numOfLine = 6;
        if (window.innerWidth > 768) {
          this.galleryPicWidth = (document.getElementById('container') as HTMLElement).clientWidth / 6;
        } else if (window.innerWidth > 576) {
          this.galleryPicWidth = (document.getElementById('container') as HTMLElement).clientWidth / 3;
          numOfLine = 3;
        } else {
          this.galleryPicWidth = (document.getElementById('container') as HTMLElement).clientWidth / 2;
          numOfLine = 2;
        }
        this.plainGalleryGrid = {
          strategy: PlainGalleryStrategy.GRID,
          layout: new GridLayout({ width: this.galleryPicWidth + 'px', height: this.galleryPicWidth + 'px' },
            { length: numOfLine, wrap: true }),
          advanced: { aTags: true, additionalBackground: '50% 50%/cover' }
        };
      });
  }
  get id() {
    return this._id;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log(event.target.valueOf().innerWidth);
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

  ngOnDestroy() {
    this.langSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
    this.gallerySubscription.unsubscribe();
  }
}
