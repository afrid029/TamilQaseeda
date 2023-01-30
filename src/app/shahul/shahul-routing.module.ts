import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShahulPage } from './shahul.page';

const routes: Routes = [
  {
    path: '',
    component: ShahulPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShahulPageRoutingModule {}
