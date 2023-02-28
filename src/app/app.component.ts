import { Component, ViewChild } from '@angular/core';
import {  AnimationController, IonRouterOutlet, LoadingController, MenuController, ModalController, Platform } from '@ionic/angular';
import { DatabaseService } from './services/database.service';
import { ObsrService } from './services/obsr.service';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen';
import { UtillService } from './services/utill.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})




export class AppComponent {
  obj: boolean = false;
  net: boolean = false;
  isLoginOpen: boolean = false;
  login = {email:'', password:''};
  spinner: boolean = false;

  isModalOpen: boolean = false;
 
  constructor(public data: DatabaseService, public obsr: ObsrService, public loadingCtrl: LoadingController,public utilService: UtillService, public menuctrl: MenuController, private modalCtrl: ModalController, private animationCtrl: AnimationController) {
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

      this.obsr.user.subscribe(re=>{
        this.obj = re;
      });

      this.obsr.network.subscribe(re=>{
        this.net = re;
      });
   }

   enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  }
   ngOnInit(){
    console.log('Appcomponent');
    this.openModal(false);
    
   }
   async openModal(state: boolean){
    // const modal = this.modalCtrl.create({
      
    // })
    this.isModalOpen = state;
    


   }

   openLogin(){
      if(!this.obj){
        this.isLoginOpen = !this.isLoginOpen;
      }else{
        this.utilService.loggedInToast();
      }
   }


   LoginAdmin(){
    if(this.net){
      this.closeMenu();
      this.spinner = true;

        this.data.LoginWithEmail(this.login).then((res: any)=>{
          
          console.log(res.user?.uid);
          this.data.setUser(res.user);
          this.obsr.user.next(true);
        
          console.log('loggged');
          this.spinner = false;
          this.isLoginOpen = false;
  
          setTimeout(()=>{
            this.login = {'email':'', 'password':''}
          this.utilService.successToast('Logged in Successfully','radio-button-on-outline','success')
          },10);
          
            
        }).catch((er: any)=>{
          this.spinner = false;
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
      this.closeMenu();
      this.spinner = true;

      setTimeout(()=>{
        this.data.logout().catch((er: any)=>{
          console.log('logout eroor');
        }).then((res: any)=>{
          console.log('logout success');
          localStorage.removeItem('user');
          this.obsr.user.next(false);
          // this.isLoginPageOpen=false;
          this.spinner = false;
            console.log('logggedout');
            this.utilService.successToast('Logged out Successfully','radio-button-on-outline','warning');
        });
      },2000)
    }else{
      this.utilService.NetworkToast();
    }
  }

  closeMenu(){
    this.isLoginOpen = false;
    this.menuctrl.close();
  }
  /************************************** */

 
  delete(){
    this.data.deleteAll();
  }

  
}
