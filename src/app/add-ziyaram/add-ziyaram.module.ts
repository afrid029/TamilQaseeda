import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddZiyaramPageRoutingModule } from './add-ziyaram-routing.module';

import { AddZiyaramPage } from './add-ziyaram.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddZiyaramPageRoutingModule
  ],
  declarations: [AddZiyaramPage]
})
export class AddZiyaramPageModule {}
