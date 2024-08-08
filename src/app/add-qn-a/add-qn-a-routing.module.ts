import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddQnAPage } from './add-qn-a.page';

const routes: Routes = [
  {
    path: '',
    component: AddQnAPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddQnAPageRoutingModule {}
