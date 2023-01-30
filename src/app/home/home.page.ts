import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { UtillService } from '../services/utill.service';
import { ObsrService } from '../services/obsr.service';
import { App } from '@capacitor/app';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  obj: Boolean;
  net: Boolean;
  isLoginPageOpen: boolean = false;
  submitButton: boolean = true;
  login = {email:'', password:''};

  constructor(public platform: Platform ,public route: Router,public db: DatabaseService,
    public toast: ToastController, private obsr: ObsrService, public routerOutlet: IonRouterOutlet,
    private utilService: UtillService, public alertctrl: AlertController) {
    
      this.platform.backButton.subscribeWithPriority(1,()=>{
          console.log('HomePage'); 
          if(this.routerOutlet.canGoBack()){
            console.log('Can Go');
          }else{
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
  const alert = await this.alertctrl.create({
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

addNewListing(){
  this.route.navigateByUrl('add');
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


Openlogin(){
  this.isLoginPageOpen = true;
}

closeModel(){
  this.isLoginPageOpen = false;
  this.login = {email:'', password:''};
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
      this.closeModel();
      console.log('loggged');
        
      this.login = {'email':'', 'password':''}
      this.route.navigateByUrl('home');
      this.utilService.successToast('Logged in Successfully','radio-button-on-outline','success')
        
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