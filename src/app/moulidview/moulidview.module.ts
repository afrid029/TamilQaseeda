import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoulidviewPageRoutingModule } from './moulidview-routing.module';

import { MoulidviewPage } from './moulidview.page';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoulidviewPageRoutingModule,
    PdfViewerModule
  ],
  declarations: [MoulidviewPage]
})
export class MoulidviewPageModule {}
