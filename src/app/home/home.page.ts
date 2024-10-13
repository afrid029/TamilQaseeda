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

  viewSet: boolean = false;

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
    //console.log('Homeview entering');

    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
      this.route.navigateByUrl('/dashboard');


    })

    const loadView = setInterval (() => {
      this.updateCss();

      if(this.viewSet){
        console.log('switching off');

        clearInterval(loadView);

      }
    },1000)
   }

   ionViewWillLeave(){
    //console.log('Home view leaving');
    this.subs.unsubscribe();
   }

   updateCss(){

    const tool = document.querySelector('.qtool') as HTMLElement;
    const grid = document.querySelector('.hgrid') as HTMLElement;
    const bar = document.querySelector('ion-tab-bar') as HTMLElement;
    const bg = document.querySelector('.bg') as HTMLElement;

    if(tool && grid){
      // console.log('viewd');

      // if(tool.offsetHeight > 0 && grid.offsetHeight > 0 && bar.offsetHeight > 0 && bg.offsetHeight > 0){
      //   console.log('true');

      // }else{
      //   console.log('false');

      // }

      const dyHeight = tool.offsetHeight;
      const barHeight = bar.offsetHeight;

      console.log(dyHeight);
      //console.log(grid.offsetHeight);
      // console.log(bar.offsetHeight > 0);
      // console.log(bg.offsetHeight > 0);
      console.log(barHeight);
      //console.log(grid.style.height);


      if(dyHeight > 0 && barHeight > 0 ){
        grid.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px)`
        grid.style.maxHeight = `calc(100vh - ${dyHeight}px -  ${barHeight}px)`
        //bg.style.height = `calc(100vh - ${dyHeight}px -  ${barHeight}px)`
        console.log('Vie Set true');
        this.viewSet = true;


      }else {
        console.log('Not enough height');

      }



   }

   }

}
