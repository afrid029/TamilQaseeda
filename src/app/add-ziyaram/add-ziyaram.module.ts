import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddZiyaramPageRoutingModule } from './add-ziyaram-routing.module';

import { AddZiyaramPage } from './add-ziyaram.page';

// import { GoogleMapComponent } from '../components/google-map/google-map.component';
import { SharedModuleModule } from '../modules/shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddZiyaramPageRoutingModule,
    SharedModuleModule
    
  ],
  declarations: [AddZiyaramPage]
})
export class AddZiyaramPageModule {}
