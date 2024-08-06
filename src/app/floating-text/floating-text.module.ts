import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FloatingTextPageRoutingModule } from './floating-text-routing.module';

import { FloatingTextPage } from './floating-text.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FloatingTextPageRoutingModule
  ],
  declarations: [FloatingTextPage]
})
export class FloatingTextPageModule {}
