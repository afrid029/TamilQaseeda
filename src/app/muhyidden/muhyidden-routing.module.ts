import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MuhyiddenPage } from './muhyidden.page';

const routes: Routes = [
  {
    path: '',
    component: MuhyiddenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MuhyiddenPageRoutingModule {}
