import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QandAPageRoutingModule } from './qand-a-routing.module';

import { QandAPage } from './qand-a.page';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QandAPageRoutingModule,
    SwiperModule
  ],
  declarations: [QandAPage]
})
export class QandAPageModule {}
