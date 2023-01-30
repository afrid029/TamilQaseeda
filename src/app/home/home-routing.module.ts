import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'prop',
    loadChildren: () => import('../prophet/prophet.module').then((m) =>m.ProphetPageModule)
  },

  {
    path: 'muhi',
    loadChildren:() => import('../muhyidden/muhyidden.module').then((m) => m.MuhyiddenPageModule)
  },
  {
    path: 'shahul',
    loadChildren:() => import('../shahul/shahul.module').then((m) => m.ShahulPageModule)
  },
  {
    path: 'ajmeer',
    loadChildren:() => import('../ajmeer/ajmeer.module').then((m) => m.AjmeerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
