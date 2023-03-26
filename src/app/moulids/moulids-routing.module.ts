import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoulidsPage } from './moulids.page';

const routes: Routes = [
  {
    path: '',
    component: MoulidsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoulidsPageRoutingModule {}
