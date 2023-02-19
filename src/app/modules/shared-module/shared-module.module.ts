import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapComponent } from 'src/app/components/google-map/google-map.component';



@NgModule({
  declarations: [GoogleMapComponent],
  imports: [
    CommonModule,
  ],
  exports: [GoogleMapComponent]
})
export class SharedModuleModule { }
