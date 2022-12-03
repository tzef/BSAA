import {AuthGuard} from './administrator.auth.guard';
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
import {AdministratorPagePlanHistoryDetailComponent} from './administrator.page.plan.history.detail.component';
import {AdministratorPageArtUpcomingDetailComponent} from './administrator.page.art.upcoming.detail.component';
import {AdministratorPageSchoolGalleryDetailComponent} from './administrator.page.school.gallery.detail.component';
import {AdministratorPageSchoolCalendarDetailComponent} from './administrator.page.school.calendar.detail.component';
import {AdministratorPageDatabaseArtistDetailComponent} from './administrator.page.database.artist.detail.component';
import {AdministratorPageDatabaseCoolguyDetailComponent} from './administrator.page.database.coolguy.detail.component';
import {AdministratorPage2018Component} from './administrator.page.2018';
import {AdministratorPage2019Component} from './administrator.page.2019';
import {AdministratorPage2020Component} from './administrator.page.2020';
import {AdministratorPage2022Component} from './administrator.page.2022';
import {AdministratorPageFormComponent} from './administrator.page.form';

export const routes = [{
  path: 'administrator',
  component: AdministratorCenterComponent,
  children: [
    {
      path: '',
      component: AdministratorLoginComponent
    },
    {
      path: 'about',
      canActivate: [AuthGuard],
      component: AdministratorPageAboutComponent
    },
    {
      path: 'plan',
      children: [
        {
          path: 'origin',
          canActivate: [AuthGuard],
          component: AdministratorPagePlanOriginComponent
        },
        {
          path: 'current',
          canActivate: [AuthGuard],
          component: AdministratorPagePlanCurrentComponent
        },
        {
          path: 'history',
          canActivate: [AuthGuard],
          component: AdministratorPagePlanHistoryComponent
        },
        {
          path: 'history/:id',
          canActivate: [AuthGuard],
          component: AdministratorPagePlanHistoryDetailComponent
        }
      ]
    },
    {
      path: 'school',
      children: [
        {
          path: 'calendar',
          canActivate: [AuthGuard],
          component: AdministratorPageSchoolCalendarComponent
        },
        {
          path: 'calendar/:id',
          canActivate: [AuthGuard],
          component: AdministratorPageSchoolCalendarDetailComponent
        },
        {
          path: 'gallery',
          canActivate: [AuthGuard],
          component: AdministratorPageSchoolGalleryComponent
        },
        {
          path: 'gallery/:id',
          canActivate: [AuthGuard],
          component: AdministratorPageSchoolGalleryDetailComponent
        }
      ]
    },
    {
      path: 'art',
      children: [
        {
          path: 'upcoming',
          canActivate: [AuthGuard],
          component: AdministratorPageArtUpcomingComponent
        },
        {
          path: 'upcoming/:id',
          canActivate: [AuthGuard],
          component: AdministratorPageArtUpcomingDetailComponent
        },
        {
          path: 'vr',
          canActivate: [AuthGuard],
          component: AdministratorPageArtVrComponent
        }
      ]
    },
    {
      path: 'database',
      children: [
        {
          path: 'artist',
          canActivate: [AuthGuard],
          component: AdministratorPageDatabaseArtistComponent
        },
        {
          path: 'artist/:id',
          canActivate: [AuthGuard],
          component: AdministratorPageDatabaseArtistDetailComponent
        },
        {
          path: 'coolguy',
          canActivate: [AuthGuard],
          component: AdministratorPageDatabaseCoolguyComponent
        },
        {
          path: 'coolguy/:id',
          canActivate: [AuthGuard],
          component: AdministratorPageDatabaseCoolguyDetailComponent
        },
      ]
    },
    {
      path: 'support',
      canActivate: [AuthGuard],
      component: AdministratorPageDonationComponents
    },
    {
      path: '2018',
      canActivate: [AuthGuard],
      component: AdministratorPage2018Component
    },
    {
      path: '2019',
      canActivate: [AuthGuard],
      component: AdministratorPage2019Component
    },
    {
      path: '2020',
      canActivate: [AuthGuard],
      component: AdministratorPage2020Component
    },
    {
      path: '2022',
      canActivate: [AuthGuard],
      component: AdministratorPage2022Component
    },
    {
      path: 'form/:id',
      canActivate: [AuthGuard],
      component: AdministratorPageFormComponent
    }
  ]
}];
