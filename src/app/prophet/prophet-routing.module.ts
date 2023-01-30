import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProphetPage } from './prophet.page';

const routes: Routes = [
  {
    path: '',
    component: ProphetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProphetPageRoutingModule {}
