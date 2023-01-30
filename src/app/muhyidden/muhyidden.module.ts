import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MuhyiddenPageRoutingModule } from './muhyidden-routing.module';

import { MuhyiddenPage } from './muhyidden.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MuhyiddenPageRoutingModule
  ],
  declarations: [MuhyiddenPage]
})
export class MuhyiddenPageModule {}
