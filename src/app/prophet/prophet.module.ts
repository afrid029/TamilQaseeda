import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProphetPageRoutingModule } from './prophet-routing.module';

import { ProphetPage } from './prophet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProphetPageRoutingModule
  ],
  declarations: [ProphetPage]
})
export class ProphetPageModule {}
