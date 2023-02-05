import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage {

  obj: Boolean;
  net: Boolean;
  subs: Subscription;

  constructor(public platform: Platform ,public route: Router,public db: DatabaseService,
   private obsr: ObsrService, public routerOutlet: IonRouterOutlet,
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
    // this.subs.unsubscribe();
  }
async handleRefresh(event: any) {
  if(this.net){
    setTimeout(() => {
      this.db.getFromFireBase();
      console.log('refreshed ');
      event.target.complete();
    }, 2000);
        
  }else{
    event.target.complete();
    this.utilService.NetworkToast();
  }
}

}
