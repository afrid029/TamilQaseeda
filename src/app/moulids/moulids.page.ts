import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { UtillService } from '../services/utill.service';
import { ObsrService } from '../services/obsr.service';
import { App } from '@capacitor/app';
import { Subscription } from 'rxjs';
import { PlatformLocation } from '@angular/common';


@Component({
  selector: 'app-moulids',
  templateUrl: './moulids.page.html',
  styleUrls: ['./moulids.page.scss'],
})
export class MoulidsPage implements OnInit {
  obj: Boolean;
  net: Boolean;
  subs: Subscription;
  spinner: boolean = false;
  // viewSet: boolean = false;

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
    //console.log('Moulidh view entering');


    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
      this.route.navigateByUrl('/');
    });



      // const loading = setInterval(()=>{
      //   this.updateCss();
      //   if(this.viewSet){
      //     clearInterval(loading);
      //   }
      // },1000);


   }


   ionViewWillLeave(){
    //console.log('Moulidh view leaving');
    this.subs.unsubscribe();
   }

   viewMoulidh(name: String){
    if(name === "muham"){
      const send:NavigationExtras = {
        queryParams: {
          source: "../../assets/pdf/சுப்ஹான மௌலிது.pdf"
        }
      }
      this.route.navigate(['moulidview'], send);
    }
    if (name === "muhi") {
      const send:NavigationExtras = {
        queryParams: {
          source: "../../assets/pdf/முஹ்யித்தீன் மௌலிது.pdf"
        }
      }
      this.route.navigate(['moulidview'], send);
    }
    if (name === "shahul") {
      const send:NavigationExtras = {
        queryParams: {
          source: "../../assets/pdf/மீரான் சாஹிபு மௌலிது.pdf"
        }
      }
      this.route.navigate(['moulidview'], send);
    }
    if (name === "hasan") {
      const send:NavigationExtras = {
        queryParams: {
          source: "../../assets/pdf/ஹஸன் - ஹுஸைன் மௌலிது.pdf"
        }
      }
      this.route.navigate(['moulidview'], send);
    }
    if (name === "badr") {
      const send:NavigationExtras = {
        queryParams: {
          source: "../../assets/pdf/பத்ர் மௌலிது.pdf"
        }
      }
      this.route.navigate(['moulidview'], send);
    }
    if (name === "ajmeer") {
      const send:NavigationExtras = {
        queryParams: {
          source: "../../assets/pdf/க்வாஜா நாயகம் மௌலிது.pdf"
        }
      }
      this.route.navigate(['moulidview'], send);
    }
   }

   ngOnInit() {
    // console.log('ngOnInit');
    //this.updateCss();


   }

  //  updateCss(){

  //   const tool = document.querySelector('.moutool') as HTMLElement;
  //   const grid1 = document.querySelector('.mgrid') as HTMLElement;
  //   const bar = document.querySelector('ion-tab-bar') as HTMLElement;
  //   const bg = document.querySelector('.bg') as HTMLElement;

  //   if(tool && grid1 && bar){
  //     // console.log('viewd');

  //     // if(tool.offsetHeight > 0 && grid.offsetHeight > 0 && bar.offsetHeight > 0 && bg.offsetHeight > 0){
  //     //   console.log('true');

  //     // }else{
  //     //   console.log('false');

  //     // }

  //     const dyHeight = tool.offsetHeight;
  //     const barHeight = bar.offsetHeight;

  //     // console.log(tool.offsetHeight);
  //     // //console.log(grid);
  //     // console.log(bar.offsetHeight);
  //     // // console.log(bg.offsetHeight > 0);
  //     // // console.log(bg.offsetHeight);
  //     // console.log(grid1.offsetHeight);


  //     if(dyHeight > 0 && barHeight > 0 ){
  //       grid1.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px)`
  //       grid1.style.maxHeight = `calc(100vh - ${dyHeight}px -  ${barHeight}px)`
  //       //bg.style.height = `calc(100vh - ${dyHeight}px -  ${barHeight}px)`
  //       // console.log('changed ',grid1.style.height);
  //       this.viewSet = true;


  //     }else {
  //       console.log('Not enough height');

  //     }
  //     // console.log(grid1.offsetHeight);



  //  }

  //  }



}
