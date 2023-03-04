import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WallalertPageRoutingModule } from './wallalert-routing.module';

import { WallalertPage } from './wallalert.page';

import { SwiperModule } from 'swiper/angular';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WallalertPageRoutingModule,
    SwiperModule
  ],
  declarations: [WallalertPage]
})
export class WallalertPageModule {}
