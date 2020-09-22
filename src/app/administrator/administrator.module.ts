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
import {AdministratorPageArtVrComponent} from './administrator.page.art.vr.component';
import {AdministratorPageDonationComponents} from './administrator.page.donation.components';
import {AdministratorPagePlanOriginComponent} from './administrator.page.plan.origin.component';
import {AdministratorPagePlanCurrentComponent} from './administrator.page.plan.current.component';
import {AdministratorPagePlanHistoryComponent} from './administrator.page.plan.history.component';
import {AdministratorPageArtUpcomingComponent} from './administrator.page.art.upcoming.component';
import {AdministratorPageSchoolGalleryComponent} from './administrator.page.school.gallery.component';
import {AdministratorPageSchoolCalendarComponent} from './administrator.page.school.calendar.component';
import {AdministratorPageDatabaseArtistComponent} from './administrator.page.database.artist.component';
import {AdministratorPageDatabaseCoolguyComponent} from './administrator.page.database.coolguy.component';
import {AdministratorPageArtUpcomingDetailComponent} from './administrator.page.art.upcoming.detail.component';
import {AdministratorPagePlanHistoryDetailComponent} from './administrator.page.plan.history.detail.component';
import {AdministratorPageSchoolGalleryDetailComponent} from './administrator.page.school.gallery.detail.component';
import {AdministratorPageSchoolCalendarDetailComponent} from './administrator.page.school.calendar.detail.component';
import {AdministratorPageDatabaseArtistDetailComponent} from './administrator.page.database.artist.detail.component';
import {AdministratorPageDatabaseCoolguyDetailComponent} from './administrator.page.database.coolguy.detail.component';
import {AdministratorPage2018Component} from './administrator.page.2018';
import {AdministratorPage2019Component} from './administrator.page.2019';
import {AdministratorPage2020Component} from './administrator.page.2020';

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
    AdministratorPageArtUpcomingComponent, AdministratorPageArtVrComponent, AdministratorPageArtUpcomingDetailComponent,
    AdministratorPageDatabaseArtistComponent, AdministratorPageDatabaseArtistDetailComponent,
    AdministratorPageDatabaseCoolguyComponent, AdministratorPageDatabaseCoolguyDetailComponent,
    AdministratorPageDonationComponents,
    AdministratorPage2018Component, AdministratorPage2019Component, AdministratorPage2020Component
  ],
  providers: [AngularFireAuth, AuthGuard],
  exports: []
})
export class AdministratorModule {
}
