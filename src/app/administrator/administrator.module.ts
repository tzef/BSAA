import {AngularFireAuth, AngularFireAuthModule} from 'angularfire2/auth';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {routes} from './routes';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NavigationModule} from '../navigation/navigation.module';
import {MDBBootstrapModulesPro} from 'ng-uikit-pro-standard';
import {ModalGalleryModule} from 'angular-modal-gallery';
import {AgmCoreModule} from '@agm/core';
import {CoreModule} from '../core/core.module';
import {AuthGuard} from './administrator.auth.guard';
import {AdministratorLoginComponent} from './administrator.login.component';
import {AdministratorCenterComponent} from './administrator.center.component';
import {AdministratorPageAboutComponent} from './administrator.page.about.component';
import {AdministratorPagePlanOriginComponent} from './administrator.page.plan.origin.component';
import {AdministratorPagePlanCurrentComponent} from './administrator.page.plan.current.component';
import {AdministratorPagePlanHistoryComponent} from './administrator.page.plan.history.component';
import {AdministratorPagePlanHistoryDetailComponent} from './administrator.page.plan.history.detail.component';
import {AdministratorPageSchoolCalendarComponent} from './administrator.page.school.calendar.component';
import {AdministratorPageSchoolCalendarDetailComponent} from './administrator.page.school.calendar.detail.component';
import {AdministratorPageSchoolGalleryComponent} from './administrator.page.school.gallery.component';
import {AdministratorPageSchoolGalleryDetailComponent} from './administrator.page.school.gallery.detail.component';

@NgModule({
  imports: [
    BrowserModule, RouterModule.forChild(routes),
    ModalGalleryModule.forRoot(), MDBBootstrapModulesPro.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAbQR5RhbaDwz6Kw3tGUgSmIdwRYCy9qxM',
      language: 'zh-TW'
    }),
    FormsModule, ReactiveFormsModule,
    NavigationModule, CoreModule,
    AngularFireAuthModule
  ],
  declarations: [
    AdministratorCenterComponent, AdministratorLoginComponent,
    AdministratorPageAboutComponent,
    AdministratorPagePlanOriginComponent, AdministratorPagePlanCurrentComponent,
    AdministratorPagePlanHistoryComponent, AdministratorPagePlanHistoryDetailComponent,
    AdministratorPageSchoolCalendarComponent, AdministratorPageSchoolCalendarDetailComponent,
    AdministratorPageSchoolGalleryComponent, AdministratorPageSchoolGalleryDetailComponent
  ],
  providers: [AngularFireAuth, AuthGuard],
  exports: []
})
export class AdministratorModule {
}
