import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AngularFireModule} from 'angularfire2';
import {SettingService} from './setting.service';
import {IntIsOddPipe} from '../pipe/int.isOdd.pipe';
import {BrowserModule} from '@angular/platform-browser';
import {environment} from '../../environments/environment';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {StringLinkModelPipe} from '../pipe/string.linkModel.pipe';
import {StringBoldModelPipe} from '../pipe/string.boldModel.pipe';
import {StringColorModelPipe} from '../pipe/string.colorModel.pipe';
import {CalendarComponent} from '../components/calendar.component';
import {PageTitleComponent} from '../components/page.title.component';
import {ImageRatioComponent} from '../components/image.ratio.component';
import {SeparateLeftComponent} from '../components/separate.left.component';
import {SeparateRightComponent} from '../components/separate.right.component';
import {StringNewLineTransformPipe} from '../pipe/string.newLineTransform.pipe';
import { ParagraphStyleComponent } from '../components/paragraph.style.component';

@NgModule({
  imports: [
    BrowserModule, FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'BSAA'),
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  declarations: [
    CalendarComponent, StringNewLineTransformPipe, IntIsOddPipe, StringLinkModelPipe, StringColorModelPipe, StringBoldModelPipe,
    PageTitleComponent, ImageRatioComponent, SeparateLeftComponent, SeparateRightComponent, ParagraphStyleComponent
  ],
  exports: [
    StringNewLineTransformPipe, IntIsOddPipe, StringLinkModelPipe, StringColorModelPipe, StringBoldModelPipe,
    PageTitleComponent, ImageRatioComponent, SeparateLeftComponent, SeparateRightComponent, ParagraphStyleComponent
  ],
  providers: [SettingService],
})
export class CoreModule {}
