import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WallalertPage } from './wallalert.page';

const routes: Routes = [
  {
    path: '',
    component: WallalertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WallalertPageRoutingModule {}
