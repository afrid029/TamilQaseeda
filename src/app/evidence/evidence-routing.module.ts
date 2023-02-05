import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvidencePage } from './evidence.page';

const routes: Routes = [
  {
    path: '',
    component: EvidencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvidencePageRoutingModule {}
