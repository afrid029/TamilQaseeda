import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DuaPageRoutingModule } from './dua-routing.module';

import { DuaPage } from './dua.page';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DuaPageRoutingModule,
    SwiperModule
  ],
  declarations: [DuaPage]
})
export class DuaPageModule {}
