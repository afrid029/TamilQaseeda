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
  spinner:boolean = false;

  constructor(public platform: Platform ,public route: Router,public db: DatabaseService,
   private obsr: ObsrService, public routerOutlet: IonRouterOutlet,
    private utilService: UtillService, public alertctrl: AlertController, public location: PlatformLocation) {
    
    
      this.obsr.network.subscribe(re=>{
        this.net=re;
      });

     this.obsr.user.subscribe(re=>{
      this.obj=re;
     })
   }

   ionViewDidEnter(){
    console.log('calendarview entering');
    
    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{

      
    })
   }

   ionViewWillLeave(){
    console.log('calendar view leaving');
    
    this.subs.unsubscribe();
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
