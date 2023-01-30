import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShahulPageRoutingModule } from './shahul-routing.module';

import { ShahulPage } from './shahul.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShahulPageRoutingModule
  ],
  declarations: [ShahulPage]
})
export class ShahulPageModule {}
