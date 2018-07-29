import {Page404Component} from './page/page.404.component';

export const routes = [
  {
    path: '',
    redirectTo: '/about',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: Page404Component
  }];
