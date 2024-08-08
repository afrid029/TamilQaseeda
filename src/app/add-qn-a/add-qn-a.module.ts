import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddQnAPageRoutingModule } from './add-qn-a-routing.module';

import { AddQnAPage } from './add-qn-a.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddQnAPageRoutingModule
  ],
  declarations: [AddQnAPage]
})
export class AddQnAPageModule {}
