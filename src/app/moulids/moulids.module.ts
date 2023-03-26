import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoulidsPageRoutingModule } from './moulids-routing.module';

import { MoulidsPage } from './moulids.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoulidsPageRoutingModule
  ],
  declarations: [MoulidsPage]
})
export class MoulidsPageModule {}
