import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjmeerPage } from './ajmeer.page';

const routes: Routes = [
  {
    path: '',
    component: AjmeerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjmeerPageRoutingModule {}
