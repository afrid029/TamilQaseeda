import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZiyaramsPage } from './ziyarams.page';

const routes: Routes = [
  {
    path: '',
    component: ZiyaramsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZiyaramsPageRoutingModule {}
