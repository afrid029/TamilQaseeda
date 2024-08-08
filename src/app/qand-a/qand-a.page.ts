import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {  Router } from '@angular/router';
import { Platform,  AlertController, IonModal } from '@ionic/angular';
import {  Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';

import SwiperCore, { EffectCoverflow, Pagination } from 'swiper';

SwiperCore.use([EffectCoverflow, Pagination]);
@Component({
  selector: 'app-qand-a',
  templateUrl: './qand-a.page.html',
  styleUrls: ['./qand-a.page.scss'],
})
export class QandAPage implements AfterViewInit {

  @ViewChild('modal1') modal: IonModal;
  @ViewChild('modal2') modal2: IonModal;


  isModalOpen: boolean = false;
  anyContent: boolean = false;
  anyUserContent: boolean = false;
  isEditOpen: boolean = false;

  obj: Boolean;
  net: Boolean;
  subs: Subscription;
  spinner: boolean = false;
  cardSpinner: boolean = false;

  AdminData: any;
  UserData: any;



  constructor(public platform: Platform ,public route: Router,public db: DatabaseService,
   private obsr: ObsrService, private utilService: UtillService, public alertctrl: AlertController) {
    this.obsr.network.subscribe(re=>{
      this.net=re;
      //console.log(re);
    });
    this.obsr.user.subscribe(re=>{
      this.obj = re
    });
   }


  ngAfterViewInit(){

  }
  ionViewWillEnter(){
    //console.log('View will enter');
    if(this.obj){
      this.getAdminData();
    }
    this.getUserData();

  }
  ionViewDidEnter(){
    //console.log('ziyaram view entering');

    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
        if(!this.isModalOpen){
          this.route.navigateByUrl('/dashboard');
        }else{
          this.isModalOpen = false
        }

    })
   }

   ionViewWillLeave(){
    //console.log('Ziyaram view leaving');

    this.subs.unsubscribe();
   }

   getAdminData(){
    this.spinner = true;
   // this.db.getAlertContent();
    this.db.GetforAdmin().subscribe((re: any)=>{
      //console.log('length : ',re.length);
      //
      if(re.length > 0){
        this.anyContent = true;
        this.AdminData = re;

      }else{
        this.anyContent = false;
      }
      this.spinner = false;
    })
   }

   getUserData(){
    this.spinner = true;
    // this.db.getAlertContent();
     this.db.GetforUsers().subscribe((re: any)=>{
       //console.log('length : ',re.length);
       //
       if(re.length > 0){
         this.anyUserContent = true;
         this.UserData = re;

       }else{
         this.anyUserContent = false;
       }
       this.spinner = false;
     })
   }

   navToAdd(){
    this.route.navigateByUrl('add-qn-a')
   }

// logScrollStart(event: any){
//   //console.log('scrolling');
//   this.btn = "hidden";
//   setTimeout(() =>{
//     this.btn = "visible";
//   },1500)

// }

}
