import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
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

    this.subs = this.platform.backButton.subscribeWithPriority(1,()=>{
      console.log('HomePage'); 
      if(this.routerOutlet.canGoBack()){
        console.log('Can Go');
      }else{
        console.log('Cant Go');
        this.toExit();
      }
    })

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
   async toExit(){
    console.log('Can exit noew');
    const alert = await this.alertCtrl.create({
      header: 'Exit ?',
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () =>{
            console.log('cancelled');  
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

  // addNewListing(){
  //   this.route.navigateByUrl('add');
  // }

  Openlogin(){
    this.isLoginPageOpen = true;
  }
  
  closeModel(){
    this.isLoginPageOpen = false;
    this.login = {email:'', password:''};
  }

  async setAddModel(val: boolean){
    this.isAddModalOpen = val;
  }

  navigateTo(val: any){
    console.log(val);
    // if(!this.isAddModalOpen){
    //   this.route.navigateByUrl(val);
    // }
    setTimeout(()=>{
      this.route.navigateByUrl(val);
      
    },10);
    this.isAddModalOpen = false;    
    //this.subs.unsubscribe();
    
  }
  
  ionModalDidDismiss(){
    this.isLoginPageOpen = false;
    this.login = {email:'', password:''};
  }
  
  loginChnage(){
    if(this.login.email !== '' && this.login.password !== ''){
      this.submitButton = false;
    }else{
      this.submitButton = true
    }
  }
  
  LoginAdmin(){
    if(this.net){
      this.db.LoginWithEmail(this.login).then((res: any)=>{
        console.log(res.user?.uid);
        this.db.setUser(res.user);
        this.obj = true;
      
        console.log('loggged');

        setTimeout(()=>{
          this.login = {'email':'', 'password':''}
        this.utilService.successToast('Logged in Successfully','radio-button-on-outline','success')
        },10);
        this.isLoginPageOpen = false;
          
        
          
      }).catch((er: any)=>{
        if(er.code === 'auth/invalid-email'){
          this.utilService.erroToast('Invalid email address, Admin Only','bug-outline')
        }else if(er.code === 'auth/user-not-found'){
          this.utilService.erroToast('You are not allowed, Admin Only','bug-outline')
        }else if(er.code === 'auth/network-request-failed'){
          this.utilService.erroToast('Network Connectivity Error','cloud-offline')
        }else{
          this.utilService.erroToast('Wrong Password','close-circle-outline')
         }
          
      });
    }else{
      this.utilService.NetworkToast();
    }
  }
  
  Logout(){
    if(this.net){
      this.db.logout().catch((er: any)=>{
        console.log('logout eroor');
      }).then((res: any)=>{
        console.log('logout success');
        localStorage.removeItem('user');
        this.obj = false;
        this.isLoginPageOpen=false;
          console.log('logggedout');
          this.utilService.successToast('Logged out Successfully','radio-button-on-outline','warning');
      });
    }else{
      this.utilService.NetworkToast();
    }
  }
  
  
  /************temp************************ */
    delete(){
      this.db.deleteAll();
    }
  

}
