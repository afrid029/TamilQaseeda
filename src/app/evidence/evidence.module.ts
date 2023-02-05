import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvidencePageRoutingModule } from './evidence-routing.module';

import { EvidencePage } from './evidence.page';
import { SwiperModule } from 'swiper/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvidencePageRoutingModule,
    SwiperModule
  ],
  declarations: [EvidencePage]
})
export class EvidencePageModule {}
