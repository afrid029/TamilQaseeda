import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddZiyaramPage } from './add-ziyaram.page';

const routes: Routes = [
  {
    path: '',
    component: AddZiyaramPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddZiyaramPageRoutingModule {}
