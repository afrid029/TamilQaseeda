import { PlatformLocation } from '@angular/common';
import { AfterViewInit, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { Platform, IonRouterOutlet, AlertController, IonContent, ScrollDetail, IonModal, IonicModule } from '@ionic/angular';
import { finalize, Observable, Subscription, tap } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';
import { Geolocation } from '@capacitor/geolocation';

import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { imgFile } from '../add-ziyaram/add-ziyaram.page';
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper';
import { FormsModule } from '@angular/forms';

SwiperCore.use([EffectCoverflow, Pagination]);

@Component({
  selector: 'app-ziyarams',
  templateUrl: './ziyarams.page.html',
  imports: [IonicModule, RouterModule, FormsModule],
  styleUrls: ['./ziyarams.page.scss'],
})
export class ZiyaramsPage implements AfterViewInit {
  @ViewChild('modal1') modal: IonModal;
  @ViewChild('modal2') modal2: IonModal;

  img: string = "./../../assets/pictures/ani.gif";
  currImg: string;
  isModalOpen: boolean = false;
  anyContent: boolean = false;
  isEditOpen: boolean = false;
  submitButton: boolean = false;
  vis: boolean = true;
  searchKey: String;
  ziyarams : any = [];
  Permziyarams : any = [];
  ZiyaramRequests: any = [];
  currZiyaram : any = {};
  editZiyaram : any = {};
  obj: Boolean;
  net: Boolean;
  subs: Subscription;
  spinner: boolean = false;
  cardSpinner: boolean = false;
  btnvalid = false;

  imgName: string;
  imgSize: number;

  fileUploadTask: AngularFireUploadTask;
  // Upload progress
  percentageVal: Observable<any>;
  // Track file uploading with snapshot
  trackSnapshot: Observable<any>;
  // Uploaded File URL
  UploadedImageURL: Observable<string>;
  // Uploaded image collection
  files: Observable<imgFile[]>;
  perc: number = 0;


  isMapOpen: boolean = false;
  long: any;
  lat: any;
  selected: boolean = false;

  province: any;
  district: any;
  place: string;

  Central = ['Kandy','Matala','Nuwera Eliya'];
  Eastern = ['Ampara', 'Batticaloa', 'Trincomale'];
  North = ['Jaffna','Kilinochi','Mannar','Mullaitivu','Vavuniya'];
  Northcentral = ['Anuradhapura', 'Polannaruwa'];
  Northwestern = ['Kurunagela', 'Puttalam'];
  Sabragamuva = ['Kegalle','Ratnapura'];
  Southern = ['Galle','Hambantota','Matara'];
  Uva = ['Badulla','Moneragala'];
  Western = ['Colombo','Gampaha','Kalutara'];

  dist: any[];
  anyReq: boolean = false;
  btn: string = "visibile";
  locationStat: string = "Locate Ziyaram Position"

  // viewSet: boolean = false;
  ReqView: boolean = false;

  constructor(public platform: Platform ,public route: Router,public db: DatabaseService,
   private obsr: ObsrService, public routerOutlet: IonRouterOutlet,
    private utilService: UtillService, public alertctrl: AlertController, public location: PlatformLocation, public storage: AngularFireStorage) {



   }
   unsbr(){
    // this.subs.unsubscribe();
  }

  ngAfterViewInit(){
    this.obsr.network.subscribe(re=>{
      this.net=re;
      //console.log(re);

      this.db.getZiyaramRequests().subscribe((re: any) =>{
          //console.log(re);
          if(re.length > 0){
            this.anyReq = true;
            this.ZiyaramRequests = re;
            // console.log(this.ZiyaramRequests.length);

          }else{
            this.ZiyaramRequests = [];
          }

        })

    });
    this.obsr.user.subscribe(re=>{
      this.obj = re
    });
    this.obsr.latitude.subscribe(re=>{
      this.lat = re;
    })

    this.obsr.longtitude.subscribe(re=>{
      this.long = re;
    })
    this.obsr.LocSelected.subscribe(re=>{
      this.selected = re;
      if(re){
        this.locationStat = 'Location Selected';
      }else{
        this.locationStat = 'Locate Ziyaram Position';
      }

      //console.log(this.locationStat);

    })
    this.getZiyarams();
  }
  ionViewWillEnter(){
    // console.log('will Enter');
    this.ReqView = false;
  }
  ionViewDidEnter(){
    //console.log('ziyaram view entering');

    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
        if(!this.isModalOpen){
          this.route.navigateByUrl('/');
        }else{
          this.isModalOpen = false
        }

    })

  // const loading = setInterval(()=>{
  //   this.updateCss();
  //   if(this.viewSet){
  //     clearInterval(loading);
  //   }
  // },1000);

 }

//  updateCss(){

//   const tool = document.querySelector('.ziytool') as HTMLElement;
//  const list = document.querySelector('.lstziy') as HTMLElement;
//  const listcont = document.querySelector('.lstcontziy') as HTMLElement;
//  const cont = document.querySelector('.contziy') as HTMLElement;
//   const bar = document.querySelector('ion-tab-bar') as HTMLElement;
//   const search = document.querySelector('.barziy') as HTMLElement;
//   //const swiper = document.querySelector('.swiper') as HTMLElement;

//   const main = document.querySelector('.mainziy') as HTMLElement;


//   if(tool && bar && search){


//     const dyHeight = tool.offsetHeight;
//     const barHeight = bar.offsetHeight;
//     const searchHeight = search.offsetHeight;

//     if(dyHeight > 0 && barHeight > 0 && searchHeight > 0){

//       main.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px)`
//       cont.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - ${searchHeight}px - 1rem)`
//       list.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - ${searchHeight}px - 1rem)`
//       listcont.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - ${searchHeight}px -1rem)`
//       //swiper.style.height = `85vh`
//       this.viewSet = true;



//     }else {
//       console.log('Not enough height');

//     }

//  }

//  }

   ionViewWillLeave(){
    //console.log('Ziyaram view leaving');

    this.subs.unsubscribe();
   }

  async getZiyarams(){
    this.spinner = true;
   this.db.getZiyarams().subscribe((data)=>{
      //console.log('Ziyaram entering ', data);
      if(data.length > 0){
        this.anyContent = true;
        this.ziyarams = data;
      // console.log( this.ziyarams.length);
        this.Permziyarams = this.ziyarams;
      }else{
        this.anyContent = false;
      }
      this.spinner = false;


    })
  }


promo(data: any){
  //this.cardSpinner = true;
  //console.log(data.docid);
  this.currZiyaram = data;
  this.isModalOpen = true;


  if(this.net){
    setTimeout(()=>{
      if(this.currZiyaram.imageUrl !== ''){
        this.img = this.currZiyaram.imageUrl;

      }else{
        this.img = "./../../assets/pictures/noImage.webp";
      }

    },2000)
  }else{
    //this.cardSpinner = false;
    this.utilService.NetworkToast();
  }
  //this.cardSpinner = false;

}

missImage(event: any){
  //alert('Image missed')
  this.img = "./../../assets/pictures/noImage.webp";
  // setTimeout(() =>{
  //   this.img = this.img1;
  // },5000)

}

setViewModel(val: any){
  this.isModalOpen=val;
  this.img = "./../../assets/pictures/ani.gif";
}
launchGoogleMap(){

  if(this.platform.is('android')){
    LaunchNavigator.isAppAvailable(LaunchNavigator.APP.GOOGLE_MAPS).then((isAvailable)=>{
      let app;
      if(isAvailable){
        app = LaunchNavigator.APP.GOOGLE_MAPS;

        LaunchNavigator.navigate([this.currZiyaram.lat, this.currZiyaram.long ], {
          app: app
      })
      }else{
        this.utilService.erroToast('App is not available', 'close-circle-outline');

      }
    })
  }else {
    let chk = true;
    LaunchNavigator.isAppAvailable(LaunchNavigator.APP.GOOGLE_MAPS).then((isAvailable)=>{
      let app;
      if(isAvailable){
        app = LaunchNavigator.APP.GOOGLE_MAPS;
        chk = false;
        LaunchNavigator.navigate([this.currZiyaram.lat, this.currZiyaram.long ], {
          app: app
      })
      }
    })

    if(chk){
      LaunchNavigator.isAppAvailable(LaunchNavigator.APP.APPLE_MAPS).then((isAvailable)=>{
        let app;
        if(isAvailable){
          app = LaunchNavigator.APP.APPLE_MAPS;
          LaunchNavigator.navigate([this.currZiyaram.lat, this.currZiyaram.long ], {
            app: app
        })
        }else{
          this.utilService.erroToast('App is not available', 'close-circle-outline');
        }
      })
    }
  }

}


handleSearch(){
  //console.log(this.Permziyarams);

  if(this.searchKey.length > 0){
    this.vis = false;
    this.ziyarams = [];
    this.Permziyarams.forEach((s: any)=>{
      if(s.name.toLowerCase().includes(this.searchKey.toLowerCase()) || s.location.toLowerCase().includes(this.searchKey.toLowerCase())){

        this.ziyarams.push(s);
      }
    })
    //console.log(this.ziyarams.length);
  }else{
    this.vis = true;
    this.ziyarams = this.Permziyarams;
  }
}

clearSearch(){
    //console.log('Clicked ', this.Permziyarams);
    this.searchKey = '';
}

EditZiyaram(data: any){

  const send:NavigationExtras = {
    queryParams: {
      source: JSON.stringify(data)
    }
  }
  this.route.navigate(['add-ziyaram'], send);
}

setEditFalse(){
  this.isEditOpen = false;
}
setMapOpen(){
  // this.isMapOpen = true;
  this.chekService();
}
async chekService(){
  const t = await Geolocation.checkPermissions().then((re)=>{
    this.route.navigateByUrl('google-map');

  }).catch(async er=>{
    this.utilService.erroToast('Turn On Your Location Service','power');


  });
}

async openActionSheet(event: any){
  const file = event.target.files.item(0);

  if(this.net){
    this.btnvalid = true;
    this.imgName = file.name;

    const fileStoragePath = `Images/${new Date().getTime()}_${file.name}`;
    const imageRef = this.storage.ref(fileStoragePath);
    this.fileUploadTask = this.storage.upload(fileStoragePath, file);
    this.percentageVal = this.fileUploadTask.percentageChanges();
    this.percentageVal.subscribe((per)=>{
      //console.log(per);
      this.perc = per/100;

    })
    //console.log(this.fileUploadTask);
    this.fileUploadTask.snapshotChanges().pipe(
      finalize(() => {
        // Retreive uploaded image storage path
        this.UploadedImageURL = imageRef.getDownloadURL();
        this.UploadedImageURL.subscribe(
          (resp) => {
            //console.log(resp);
            this.editZiyaram.imageUrl = resp;
            this.utilService.successToast('Picture has been successfully uploaded.', 'cloud-done', 'success');
            this.btnvalid = false;
          },
          (error) => {
            this.utilService.erroToast(error.message, 'cellular-outline');
          }
        );
      }),
      tap((snap: any) => {
        this.imgSize = snap.totalBytes;
      })
    ).subscribe();
  }else{
    this.utilService.NetworkToast();
  }


}

async deleteZiyaram(data: any){
  if(this.net){
    const alert = await this.alertctrl.create({
      header: 'Are You Sure To Delete',
      cssClass: 'delAlert',
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () =>{
            //console.log('cancelled');

          }
        },{
          text: 'Delete',
          role: 'confirm',
          handler: () =>{
            this.spinner = true;
            //console.log('delete Conformed');
             this.db.deleteZiyaramFireBase(data).then(()=>{
              this.spinner = false;
                  this.utilService.successToast('Ziyaram Detail deleted successfully','trash-outline','warning');
              }).catch((er)=>{
                this.spinner = false;
                this.utilService.erroToast('Something Went Wrong', 'bug-outline');
              });

          }
        }
      ]
    });
    await alert.present();
  }else{
    this.utilService.NetworkToast();
  }
}
async deleteZiyaramRequest(data: any){
  if(this.net){
    const alert = await this.alertctrl.create({
      header: 'Are You Sure To Delete',
      cssClass: 'delAlert',
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () =>{
            //console.log('cancelled');

          }
        },{
          text: 'Delete',
          role: 'confirm',
          handler: () =>{
            this.spinner = true;
            //console.log('delete Confirmed');
             this.db.deleteZiyaramRequestFirebase(data).then((re)=>{
              this.spinner = false;
              //console.log(re);

                  this.utilService.successToast('Ziyaram Detail deleted successfully','trash-outline','warning');
              }).catch((er)=>{
                this.spinner = false;
                this.utilService.erroToast('Something Went Wrong', 'bug-outline');
              });

          }
        }
      ]
    });
    await alert.present();
  }else{
    this.utilService.NetworkToast();
  }
}

setArray(){
  if(this.province === 'Central Province'){
    this.dist = this.Central;
  }
  if(this.province === 'Eastern Province'){
    this.dist = this.Eastern;
  }
  if(this.province === 'North Province'){
    this.dist = this.North;
  }
  if(this.province === 'Northcentral Province'){
    this.dist = this.Northcentral;
  }
  if(this.province === 'Northwestern Province'){
    this.dist = this.Northwestern;
  }
  if(this.province === 'Southern Province'){
    this.dist = this.Southern;
  }
  if(this.province === 'Sabragamuva Province'){
    this.dist = this.Sabragamuva;
  }
  if(this.province === 'Uva Province'){
    this.dist = this.Uva;
  }
  if(this.province === 'Western Province'){
    this.dist = this.Western;
  }
}

logScrollStart(event: any){
  //console.log('scrolling');
  this.btn = "hidden";
  setTimeout(() =>{
    this.btn = "visible";
  },1500)

}

pageTrans(){
  this.ReqView = !this.ReqView
}


}


