import { Component, ViewChild } from '@angular/core';
import {  AnimationController, IonRouterOutlet, LoadingController, MenuController, ModalController, Platform } from '@ionic/angular';
import { DatabaseService } from './services/database.service';
import { ObsrService } from './services/obsr.service';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen';
import { UtillService } from './services/utill.service';
import { distinctUntilChanged, share, Subscription, take, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StatusBar } from '@capacitor/status-bar';


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
  alerts: any = [];
  content: any = {};
  i: number = 0;
  length: number;
  isModalOpen: boolean = false;
  isAboutOpen: boolean = false;
  isTopicOpen: boolean = false;
  isAndroid: boolean = true;

  constructor(public data: DatabaseService, public obsr: ObsrService, public loadingCtrl: LoadingController,public utilService: UtillService, public menuctrl: MenuController, private modalCtrl: ModalController, private animationCtrl: AnimationController,
    private db: DatabaseService, private http: HttpClient, private platform: Platform) {
      // const googleMapsLink = 'https://maps.app.goo.gl/xuqDg7WM6wu141EWA';

      // const api ='https://maps.googleapis.com/maps/api/geocode/json';

      // const queryParams = {
      //   address: 'https://maps.app.goo.gl/xuqDg7WM6wu141EWA',
      //   key: 'AIzaSyBWTpiUf6Zbjzcu2hEOSgrPMYVCQ7VPWIw', // Replace with your API key
      // };

      // this.http.get<any>(api, { params: queryParams }).subscribe(re=>{
      //   //console.log('geo',re);
      // });

    // this.geo.geocode(googleMapsLink).then(
    //   (result) => {
    //     const latitude = result.latitude;
    //     const longitude = result.longitude;

    //     //console.log(latitude, longitude);
    //   },
    //   (error) => {
    //     //console.error(error);
    //   }
    // );


    AndroidFullScreen.isImmersiveModeSupported().then(()=>{
      //AndroidFullScreen.immersiveMode();
    }).catch(console.warn);

    if(this.platform.is('ios')){
      StatusBar.hide();
      this.isAndroid = false
    }else if(this.platform.is('android')){
      this.isAndroid = true;
      //StatusBar.hide();
    }


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
      .fromTo('opacity', '0.00001', 'var(--backdrop-opacity)');

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
    //console.log('Appcomponent');

   let o = this.db.getTodayContent().pipe(take(1));
   o.subscribe((cont: any)=>{
      //console.log('Alerts Count ', cont.length);

        if(cont.length > 0){
          //console.log(cont.length);
          this.alerts = cont;
          this.length = cont.length;
          this.openModal(true);
        }

    });
    //this.openModal(false);


   }

   async openModal(state: boolean){
    // const modal = this.modalCtrl.create({

    // })

    if(state){
      const k = this.i
      //console.log(k);

      this.content = this.alerts[k];
      this.i = k + 1;
      this.isModalOpen = true;
    }

    if(!state){
      if(this.i >= this.length){
        this.isModalOpen = false;
        this.i = 0;
      }else{
        //console.log(this.i, this.length);

        this.isModalOpen = false;
        setTimeout(()=>{
          this.content = this.alerts[this.i];
          this.i = this.i + 1;
          this.isModalOpen = true;
        },500)
      }
    }



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

          //console.log(res.user?.uid);
          this.data.setUser(res.user);
          this.obsr.user.next(true);

          //console.log('loggged');
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
      this.isTopicOpen = false;

      setTimeout(()=>{
        this.data.logout().catch((er: any)=>{
          //console.log('logout eroor');
        }).then((res: any)=>{
          //console.log('logout success');
          localStorage.removeItem('user');
          this.obsr.user.next(false);
          // this.isLoginPageOpen=false;
          this.spinner = false;

            //console.log('logggedout');
            this.utilService.successToast('Logged out Successfully','radio-button-on-outline','warning');
        });
      },2000)
    }else{
      this.utilService.NetworkToast();
    }
  }

  closeMenu(){
    this.openTitle(false);
  }


  openAboutUs(state: boolean){
    this.isAboutOpen = state;
  }

  openTitle(state: boolean){
    this.isTopicOpen = state;
  }




}
