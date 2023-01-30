import { Component } from '@angular/core';
import { IonRouterOutlet, LoadingController, Platform } from '@ionic/angular';
import { DatabaseService } from './services/database.service';
import { ObsrService } from './services/obsr.service';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})


export class AppComponent {
  
 
  constructor(public data: DatabaseService, public obsr: ObsrService, public loadingCtrl: LoadingController) {
    AndroidFullScreen.isImmersiveModeSupported().then(()=>{
      AndroidFullScreen.immersiveMode();
    }).catch(console.warn)
    this.data.createDatabase().then(()=>{
       const a = setInterval(()=>{
        if (this.obsr.database) {
          console.log('received');
          this.data.createTables();
          clearInterval(a);
          
        }else{
          console.log('not received');
        }
       },1000)
       
      });
    
   }

 
}
