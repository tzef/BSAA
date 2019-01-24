import {routes} from './routes';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {CoreModule} from '../core/core.module';
import {Page404Component} from './page.404.component';
import {BrowserModule} from '@angular/platform-browser';
import {ModalGalleryModule} from 'angular-modal-gallery';
import {PageAboutComponent} from './page.about.component';
import {PageArtVrComponent} from './page.art.vr.component';
import {MDBBootstrapModulesPro} from 'ng-uikit-pro-standard';
import {PageDonationComponent} from './page.donation.component';
import {NavigationModule} from '../navigation/navigation.module';
import {PagePlanFormComponent} from './page.plan.form.component';
import {PagePlanOriginComponent} from './page.plan.origin.component';
import {PagePlanCurrentComponent} from './page.plan.current.component';
import {PagePlanHistoryComponent} from './page.plan.history.component';
import {PageArtUpcomingComponent} from './page.art.upcoming.component';
import {PageSchoolGalleryComponent} from './page.school.gallery.component';
import {PageSchoolCalendarComponent} from './page.school.calendar.component';
import {PageDatabaseArtistComponent} from './page.database.artist.component';
import {PageDatabaseCoolguyComponent} from './page.database.coolguy.component';
import {PageArtUpcomingDetailComponent} from './page.art.upcoming.detail.component';
import {PagePlanHistoryDetailComponent} from './page.plan.history.detail.component';
import {PageSchoolGalleryDetailComponent} from './page.school.gallery.detail.component';
import {PageSchoolCalendarDetailComponent} from './page.school.calendar.detail.component';
import {PageDatabaseArtistDetailComponent} from './page.database.artist.detail.component';
import {PageSchoolCalendarDetailFormComponent} from './page.school.calendar.detail.form.component';
import {PageDatabaseCoolguyDetailComponent} from './page.database.coolguy.detail.component';

@NgModule({
  imports: [
    BrowserModule, FormsModule,
    ModalGalleryModule.forRoot(),
    NavigationModule, CoreModule,
    RouterModule.forChild(routes),
    MDBBootstrapModulesPro.forRoot()
  ],
  declarations: [
    Page404Component, PageAboutComponent,
    PagePlanOriginComponent, PagePlanCurrentComponent, PagePlanHistoryComponent, PagePlanHistoryDetailComponent, PagePlanFormComponent,
    PageSchoolCalendarComponent, PageSchoolCalendarDetailComponent, PageSchoolCalendarDetailFormComponent,
    PageSchoolGalleryComponent, PageSchoolGalleryDetailComponent,
    PageArtUpcomingComponent, PageArtVrComponent, PageArtUpcomingDetailComponent,
    PageDatabaseArtistComponent, PageDatabaseArtistDetailComponent,
    PageDatabaseCoolguyComponent, PageDatabaseCoolguyDetailComponent,
    PageDonationComponent
  ],
  providers: [],
  exports: []
})
export class PageModule {
}
