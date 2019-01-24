import {PageAboutComponent} from './page.about.component';
import {PageArtVrComponent} from './page.art.vr.component';
import {PageArtUpcomingComponent} from './page.art.upcoming.component';
import {PageArtUpcomingDetailComponent} from './page.art.upcoming.detail.component';
import {PageDonationComponent} from './page.donation.component';
import {PagePlanFormComponent} from './page.plan.form.component';
import {PagePlanOriginComponent} from './page.plan.origin.component';
import {PagePlanCurrentComponent} from './page.plan.current.component';
import {PagePlanHistoryComponent} from './page.plan.history.component';
import {PagePlanHistoryDetailComponent} from './page.plan.history.detail.component';
import {PageSchoolGalleryComponent} from './page.school.gallery.component';
import {PageSchoolCalendarComponent} from './page.school.calendar.component';
import {PageSchoolGalleryDetailComponent} from './page.school.gallery.detail.component';
import {PageSchoolCalendarDetailComponent} from './page.school.calendar.detail.component';
import {PageSchoolCalendarDetailFormComponent} from './page.school.calendar.detail.form.component';
import {PageDatabaseArtistComponent} from './page.database.artist.component';
import {PageDatabaseCoolguyComponent} from './page.database.coolguy.component';
import {PageDatabaseArtistDetailComponent} from './page.database.artist.detail.component';
import {PageDatabaseCoolguyDetailComponent} from './page.database.coolguy.detail.component';

export const routes = [
  {
    path: 'about',
    component: PageAboutComponent,
  },
  {
    path: 'plan',
    children: [
      {
        path: 'form',
        component: PagePlanFormComponent
      },
      {
        path: 'origin',
        component: PagePlanOriginComponent
      },
      {
        path: 'current',
        component: PagePlanCurrentComponent
      },
      {
        path: 'history',
        component: PagePlanHistoryComponent
      },
      {
        path: 'history/:id',
        component: PagePlanHistoryDetailComponent
      }
    ]
  },
  {
    path: 'school',
    children: [
      {
        path: 'calendar',
        component: PageSchoolCalendarComponent
      },
      {
        path: 'calendar/:id',
        component: PageSchoolCalendarDetailComponent
      },
      {
        path: 'calendar/form/:id',
        component: PageSchoolCalendarDetailFormComponent
      },
      {
        path: 'gallery',
        component: PageSchoolGalleryComponent
      },
      {
        path: 'gallery/:id',
        component: PageSchoolGalleryDetailComponent
      }
    ]
  },
  {
    path: 'art',
    children: [
      {
        path: 'upcoming',
        component: PageArtUpcomingComponent
      },
      {
        path: 'upcoming/:id',
        component: PageArtUpcomingDetailComponent
      },
      {
        path: 'vr',
        component: PageArtVrComponent
      }
    ]
  },
  {
    path: 'database',
    children: [
      {
        path: 'artist',
        component: PageDatabaseArtistComponent
      },
      {
        path: 'artist/:id',
        component: PageDatabaseArtistDetailComponent
      },
      {
        path: 'coolguy',
        component: PageDatabaseCoolguyComponent
      },
      {
        path: 'coolguy/:id',
        component: PageDatabaseCoolguyDetailComponent
      },
    ]
  },
  {
    path: 'support',
    component: PageDonationComponent
  }
];
