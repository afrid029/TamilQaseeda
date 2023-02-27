import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDuaPage } from './add-dua.page';

const routes: Routes = [
  {
    path: '',
    component: AddDuaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDuaPageRoutingModule {}
