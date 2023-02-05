import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCalendarPage } from './add-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: AddCalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCalendarPageRoutingModule {}
