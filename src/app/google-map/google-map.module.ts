import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoogleMapPageRoutingModule } from './google-map-routing.module';

import { GoogleMapPage } from './google-map.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoogleMapPageRoutingModule
  ],
  declarations: [GoogleMapPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GoogleMapPageModule {}
