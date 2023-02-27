import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DuaPage } from './dua.page';

const routes: Routes = [
  {
    path: '',
    component: DuaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DuaPageRoutingModule {}
