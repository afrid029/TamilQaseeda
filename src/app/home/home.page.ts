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
    
    //   this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
    //     if(this.routerOutlet.canGoBack()){
    //        this.unsbr();
    //         this.location.back();
    //         console.log('helloww');
    //     }else{
    //       console.log('11111111111111111');
          
    //     }
    // })
      this.obsr.network.subscribe(re=>{
        this.net=re;
      });

      console.log(localStorage.getItem('user'));
      if(localStorage.getItem('user')){
        console.log("set");
        this.obj = true;
        
      }else{
        console.log("unset");
        this.obj = false;
        
      }
   }
   unsbr(){
    //this.subs.unsubscribe();
    console.log('Unsubscribed');
    
  }

async handleRefresh(event: any) {
  if(this.net){
    this.spinner = true;
    setTimeout(() => {
      this.db.getFromFireBase();
      console.log('refreshed ');
      event.target.complete();
      this.spinner = false;
    }, 2000);

        
  }else{
    event.target.complete();
    this.utilService.NetworkToast();
  }
}

}