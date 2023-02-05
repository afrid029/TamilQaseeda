import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { finalize, Observable, Subscription, tap } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';

import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { imgFile } from '../add-ziyaram/add-ziyaram.page';

@Component({
  selector: 'app-ziyarams',
  templateUrl: './ziyarams.page.html',
  styleUrls: ['./ziyarams.page.scss'],
})
export class ZiyaramsPage {

  img: string = "./../../assets/pictures/noImage.png";
  img1: string = "./../../assets/pictures/noImage.png";
  currImg: string;
  isModalOpen: boolean = false;
  anyContent: boolean = false;
  isEditOpen: boolean = false;
  submitButton: boolean = false;
  vis: String = "hidden";
  searchKey: String;
  ziyarams : any = [];
  Permziyarams : any = [];
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

  constructor(public platform: Platform ,public route: Router,public db: DatabaseService,
   private obsr: ObsrService, public routerOutlet: IonRouterOutlet,
    private utilService: UtillService, public alertctrl: AlertController, public location: PlatformLocation, public storage: AngularFireStorage) {
    
      this.obsr.network.subscribe(re=>{
        this.net=re;
      });
      this.obsr.user.subscribe(re=>{
        this.obj = re
      });
      
      
   }
   unsbr(){
    // this.subs.unsubscribe();
  }
  ionViewWillEnter(){
    console.log('will Enter');
    this.getZiyarams();
  }
  ionViewDidEnter(){
    console.log('ziyaram view entering');
    
    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{

      
    })
   }

   ionViewWillLeave(){
    console.log('Ziyaram view leaving');
    
    this.subs.unsubscribe();
   }

  async getZiyarams(){
    this.spinner = true;
   return this.db.getZiyarams().then((data)=>{
      console.log('Ziyaram entering ', data);
      this.ziyarams = [];
      console.log('Ziyaram entering', this.ziyarams.length);
      if(data.rows.length > 0){
        this.anyContent = true;
        for(var i=0; i< data.rows.length; i++) {
          this.ziyarams.push(data.rows.item(i));
        }
        console.log('song', this.ziyarams);
        this.Permziyarams = this.ziyarams;
      }else{
        this.anyContent = false;
      }
      this.spinner = false;
      
      
    }).catch((e)=>{
      this.spinner = false;
      console.log(e);
      this.utilService.erroToast(e,'analytics-outline');
      })
  }
async handleRefresh(event: any) {
  if(this.net){
    this.spinner = true;
    setTimeout(() => {
      this.db.getZiyaramFromFireBase().then((re)=>{
        event.target.complete();
        console.log('AAAAAAAAA');
      });
      
     
    }, 2000);

    setTimeout(async ()=>{
      console.log('BBBBBBBB');
      this.getZiyarams();
      this.spinner = false;
    },4000)
        
  }else{
    event.target.complete();
    this.utilService.NetworkToast();
  }
  
}

promo(data: any){
  this.cardSpinner = true;
  console.log(data.docid);
  this.currZiyaram = data;
  this.isModalOpen = true;  
 
  
  if(this.net){
    setTimeout(()=>{
      if(this.currZiyaram.imageUrl !== ''){
        this.img = this.currZiyaram.imageUrl;

      }
      this.cardSpinner = false;
    },2000)
  }else{
    this.cardSpinner = false;
    this.utilService.NetworkToast();
  }
  
}

missImage(event: any){
  //alert('Image missed')
  this.img = this.img1;
} 

setViewModel(val: any){
  this.isModalOpen=val;
  this.img = "./../../assets/pictures/noImage.png";
}
launchGoogleMap(){
  LaunchNavigator.isAppAvailable(LaunchNavigator.APP.GOOGLE_MAPS).then((isAvailable)=>{
    let app;
    if(isAvailable){
      app = LaunchNavigator.APP.GOOGLE_MAPS;
    
      LaunchNavigator.navigate([this.currZiyaram.long, this.currZiyaram.lat ], {
        app: app
    })
    }else{
      alert("App not available");
    }
  })
}


handleSearch(){
  if(this.searchKey.length > 0){
    this.vis = "visible";
    this.ziyarams = [];
    this.Permziyarams.forEach((s: any)=>{
      if(s.name.toLowerCase().includes(this.searchKey.toLowerCase()) || s.location.toLowerCase().includes(this.searchKey.toLowerCase())){
        
        this.ziyarams.push(s);
      } 
    })
    console.log(this.ziyarams.length);
  }else{
    this.vis = "hidden";
    this.ziyarams = this.Permziyarams;
  }
}
 
clearSearch(){
    console.log('Clicked ', this.Permziyarams);
    this.searchKey = ''; 
}

EditZiyaram(data: any){
  this.editZiyaram = data;
  this.currImg = data.imageUrl;
  console.log(this.currImg);
  console.log(this.editZiyaram); 
  this.isEditOpen = true
}
setEditFalse(){
  this.isEditOpen = false;
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
      console.log(per);
      this.perc = per/100;
  
    })    
    console.log(this.fileUploadTask);
    this.fileUploadTask.snapshotChanges().pipe(
      finalize(() => {
        // Retreive uploaded image storage path
        this.UploadedImageURL = imageRef.getDownloadURL();
        this.UploadedImageURL.subscribe(
          (resp) => {
            console.log(resp);
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

update(){
  if(this.net){
    this.spinner = true;
    this.isEditOpen = false;
    this.editZiyaram.updatedDate = new Date().getTime();
    this.editZiyaram.deleted = false;
    this.db.updateZiyaramFireBase(this.editZiyaram).then(()=>{
      if(this.currImg.length > 1){
        this.storage.storage.refFromURL(this.currImg).delete().catch((er)=>{
          this.utilService.erroToast('Error in photo replacing ','alert-circle-outline')
        });
        this.currImg = '';
      }
      this.spinner = false;
      this.utilService.successToast('Ziyaram updated successfully','thumbs-up-outline','success');
    }).catch(er =>{
      this.spinner = false;
      this.utilService.erroToast('Something Went Wrong', 'bug-outline');
    });
  }else{
    this.utilService.NetworkToast();
  }
}

async deleteZiyaram(data: any){
  if(this.net){
    const alert = await this.alertctrl.create({
      header: 'Are You Sure To Delete',
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () =>{
            console.log('cancelled');
            
          }
        },{
          text: 'Delete',
          role: 'confirm',
          handler: () =>{
            this.spinner = true;
            console.log('delete Conformed');
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


}


