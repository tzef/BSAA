import {routes} from './routes';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CoreModule} from '../core/core.module';
import {AuthGuard} from './administrator.auth.guard';
import {BrowserModule} from '@angular/platform-browser';
import {ModalGalleryModule} from 'angular-modal-gallery';
import {MDBBootstrapModulesPro} from 'ng-uikit-pro-standard';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NavigationModule} from '../navigation/navigation.module';
import {AngularFireAuth, AngularFireAuthModule} from 'angularfire2/auth';
import {AdministratorLoginComponent} from './administrator.login.component';
import {AdministratorCenterComponent} from './administrator.center.component';
import {AdministratorPageAboutComponent} from './administrator.page.about.component';
import {AdministratorPageDonationComponents} from './administrator.page.donation.components';
import {AdministratorPagePlanOriginComponent} from './administrator.page.plan.origin.component';
import {AdministratorPagePlanCurrentComponent} from './administrator.page.plan.current.component';
import {AdministratorPagePlanHistoryComponent} from './administrator.page.plan.history.component';
import {AdministratorPageSchoolGalleryComponent} from './administrator.page.school.gallery.component';
import {AdministratorPageSchoolCalendarComponent} from './administrator.page.school.calendar.component';
import {AdministratorPagePlanHistoryDetailComponent} from './administrator.page.plan.history.detail.component';
import {AdministratorPageSchoolGalleryDetailComponent} from './administrator.page.school.gallery.detail.component';
import {AdministratorPageSchoolCalendarDetailComponent} from './administrator.page.school.calendar.detail.component';

@NgModule({
  imports: [
    BrowserModule,
    AngularFireAuthModule,
    ModalGalleryModule.forRoot(),
    NavigationModule, CoreModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule,
    MDBBootstrapModulesPro.forRoot(),
  ],
  declarations: [
    AdministratorCenterComponent, AdministratorLoginComponent,
    AdministratorPageAboutComponent,
    AdministratorPagePlanOriginComponent, AdministratorPagePlanCurrentComponent,
    AdministratorPagePlanHistoryComponent, AdministratorPagePlanHistoryDetailComponent,
    AdministratorPageSchoolCalendarComponent, AdministratorPageSchoolCalendarDetailComponent,
    AdministratorPageSchoolGalleryComponent, AdministratorPageSchoolGalleryDetailComponent,
    AdministratorPageDonationComponents
  ],
  providers: [AngularFireAuth, AuthGuard],
  exports: []
})
export class AdministratorModule {
}
