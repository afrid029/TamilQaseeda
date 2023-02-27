import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DuaPageRoutingModule } from './dua-routing.module';

import { DuaPage } from './dua.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DuaPageRoutingModule
  ],
  declarations: [DuaPage]
})
export class DuaPageModule {}
