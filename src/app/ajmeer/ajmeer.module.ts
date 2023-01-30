import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjmeerPageRoutingModule } from './ajmeer-routing.module';

import { AjmeerPage } from './ajmeer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjmeerPageRoutingModule
  ],
  declarations: [AjmeerPage]
})
export class AjmeerPageModule {}
