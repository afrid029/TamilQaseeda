import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FloatingTextPageRoutingModule } from './floating-text-routing.module';

import { FloatingTextPage } from './floating-text.page';

import { SwiperModule } from 'swiper/angular';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FloatingTextPageRoutingModule,
    SwiperModule
  ],
  declarations: [FloatingTextPage]
})
export class FloatingTextPageModule {}
