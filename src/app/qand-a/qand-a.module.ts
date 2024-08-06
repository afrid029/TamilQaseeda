import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QandAPageRoutingModule } from './qand-a-routing.module';

import { QandAPage } from './qand-a.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QandAPageRoutingModule
  ],
  declarations: [QandAPage]
})
export class QandAPageModule {}
