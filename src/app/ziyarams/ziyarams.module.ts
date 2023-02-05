import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZiyaramsPageRoutingModule } from './ziyarams-routing.module';

import { ZiyaramsPage } from './ziyarams.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZiyaramsPageRoutingModule,
  ],
  declarations: [ZiyaramsPage]
})
export class ZiyaramsPageModule {}
