import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCalendarPageRoutingModule } from './add-calendar-routing.module';

import { AddCalendarPage } from './add-calendar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCalendarPageRoutingModule
  ],
  declarations: [AddCalendarPage]
})
export class AddCalendarPageModule {}
