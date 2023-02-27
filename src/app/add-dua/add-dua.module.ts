import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDuaPageRoutingModule } from './add-dua-routing.module';

import { AddDuaPage } from './add-dua.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddDuaPageRoutingModule
  ],
  declarations: [AddDuaPage]
})
export class AddDuaPageModule {}
