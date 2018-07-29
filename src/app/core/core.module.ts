import {NgModule} from '@angular/core';
import {PageTitleComponent} from '../components/page.title.component';
import {IntIsOddPipe} from '../pipe/int.isOdd.pipe';
import {ImageRatioComponent} from '../components/image.ratio.component';
import {SeparateRightComponent} from '../components/separate.right.component';
import {StringNewLineTransformPipe} from '../pipe/string.newLineTransform.pipe';
import {SeparateLeftComponent} from '../components/separate.left.component';
import {SettingService} from './setting.service';
import {environment} from '../../environments/environment';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {AngularFireModule} from 'angularfire2';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule, FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'BSAA'),
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  declarations: [
    StringNewLineTransformPipe, IntIsOddPipe,
    PageTitleComponent, ImageRatioComponent, SeparateLeftComponent, SeparateRightComponent
  ],
  exports: [
    StringNewLineTransformPipe, IntIsOddPipe,
    PageTitleComponent, ImageRatioComponent, SeparateLeftComponent, SeparateRightComponent
  ],
  providers: [SettingService],
})
export class CoreModule {}
