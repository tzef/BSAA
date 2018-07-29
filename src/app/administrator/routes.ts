import {AdministratorLoginComponent} from './administrator.login.component';
import {AuthGuard} from './administrator.auth.guard';
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
          component: AdministratorPageSchoolCalendarDetailComponent
        },
        {
          path: 'gallery',
          component: AdministratorPageSchoolGalleryComponent
        },
        {
          path: 'gallery/:id',
          component: AdministratorPageSchoolGalleryDetailComponent
        }
      ]
    }
  ]
}];
