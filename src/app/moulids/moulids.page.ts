import { Component, OnInit } from '@angular/core';
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
    console.log('Moulidh view entering');

    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
      this.route.navigateByUrl('/dashboard');


    })


   }

   ionViewWillLeave(){
    console.log('Moulidh view leaving');
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
  }

}
