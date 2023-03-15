import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { UtillService } from '../services/utill.service';
import { ObsrService } from '../services/obsr.service';
import { App } from '@capacitor/app';
import { Subscription } from 'rxjs';
import { PlatformLocation } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  obj: Boolean;
  net: Boolean;
  subs: Subscription;
  spinner: boolean = false;

  constructor(public platform: Platform ,public route: Router,public db: DatabaseService,
    public toast: ToastController, private obsr: ObsrService, public routerOutlet: IonRouterOutlet,
    private utilService: UtillService, public alertctrl: AlertController, public location: PlatformLocation) {
    
      this.obsr.network.subscribe(re=>{
        this.net=re;
      });

      this.obsr.user.subscribe(re=>{
        this.obj = re;
      })
   }
  ionViewDidEnter(){
    console.log('Homeview entering');
    
    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
      this.route.navigateByUrl('/dashboard');

      
    })
   }

   ionViewWillLeave(){
    console.log('Home view leaving');
    this.subs.unsubscribe();
   }

// async handleRefresh(event: any) {
//   if(this.net){
//     this.spinner = true;
//     setTimeout(() => {
//       this.db.getFromFireBase();
//       console.log('refreshed ');
//       event.target.complete();
//       this.spinner = false;
//     }, 2000);

        
//   }else{
//     event.target.complete();
//     this.utilService.NetworkToast();
//   }
// }

}