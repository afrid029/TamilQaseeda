import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZiyaramsPageRoutingModule } from './ziyarams-routing.module';

import { ZiyaramsPage } from './ziyarams.page';
// import { GoogleMapComponent } from '../components/google-map/google-map.component';
import { SharedModuleModule } from '../modules/shared-module/shared-module.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZiyaramsPageRoutingModule,
    SharedModuleModule,
    SwiperModule

  ],
  declarations: [ZiyaramsPage]
})
export class ZiyaramsPageModule {}
