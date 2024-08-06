import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FloatingTextPage } from './floating-text.page';

const routes: Routes = [
  {
    path: '',
    component: FloatingTextPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FloatingTextPageRoutingModule {}
