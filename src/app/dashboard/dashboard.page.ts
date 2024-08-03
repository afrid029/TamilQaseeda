import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AlertController, IonModal, IonRouterOutlet, Platform } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper';
import { Subscription } from 'rxjs';

SwiperCore.use([EffectCoverflow, Pagination]);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  @ViewChild(IonModal) modal: IonModal;
  obj: Boolean;
  net: Boolean;
  isLoginPageOpen: boolean = false;
  isAddModalOpen: boolean = false;
  submitButton: boolean = true;
  login = {email:'', password:''};
  subs: Subscription;

  constructor(public route: Router, public platform: Platform, public routerOutlet: IonRouterOutlet,
    public alertCtrl: AlertController, public db: DatabaseService, public utilService: UtillService,
    public obsr: ObsrService) {



    this.obsr.network.subscribe(re=>{
      this.net=re;
    });

    this.obsr.user.subscribe(re=>{
      //console.log('User ',re);
      this.obj = re;
    })



   }
   ionViewDidEnter(){
    //console.log('view entering');
    this.subs = this.platform.backButton.subscribeWithPriority(1,()=>{
      //console.log('Dashboard ',this.constructor.name);

        this.toExit();

    })
   }

   ionViewWillLeave(){
    //console.log('view leaving');

    this.subs.unsubscribe();
   }
   async toExit(){
    //console.log('Can exit noew');
    const alert = await this.alertCtrl.create({
      header: 'Exit ?',
      cssClass: 'al',
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () =>{
            //console.log('cancelld');
            }
        },{
          text: 'Exit',
          role: 'confirm',
          handler: () =>{
            App.exitApp();
          }
        }]
    });
    await alert.present();
  }



  navigateTo(val: any){
    //console.log(val);

    setTimeout(()=>{
      this.route.navigateByUrl(val);

    },10);
    this.isAddModalOpen = false;

  }




}
