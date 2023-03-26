import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoulidviewPage } from './moulidview.page';

const routes: Routes = [
  {
    path: '',
    component: MoulidviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoulidviewPageRoutingModule {}
