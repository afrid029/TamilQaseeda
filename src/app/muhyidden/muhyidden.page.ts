import { Component } from '@angular/core';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { PlatformLocation } from '@angular/common';
import { UtillService } from '../services/utill.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-muhyidden',
  templateUrl: './muhyidden.page.html',
  styleUrls: ['./muhyidden.page.scss'],
})
export class MuhyiddenPage {

  isModalOpen: boolean = false;
  anyContent: boolean = false;
  isEditOpen: boolean = false;
  submitButton: boolean = false;
  vis: boolean = true;
  searchKey: String;
  songs : any = [];
  Permsongs : any = [];
  currSong : any = {};
  editSong : any = {};
  obj: boolean;
  net: boolean;
  subs: Subscription;
  spinner: boolean = false;
  viewSet: boolean = false;

  constructor(public db: DatabaseService, public obs: ObsrService, public platform: Platform, public routerOutlet: IonRouterOutlet, public location: PlatformLocation, public util: UtillService, public alertctrl: AlertController,public route:Router,
    public obsr: ObsrService) {

    this.obsr.network.subscribe(re=>{
      this.net=re;
    });


    this.obsr.user.subscribe(re=>{
      this.obj = re
    });
}
unsbr(){
  this.subs.unsubscribe();
}

ionVieWillLoad() {
    //console.log('will load');
}

ionViewWillEnter(){
  //console.log('will Enter');
  this.getSongs();
}
ionViewDidEnter(){
  //console.log('Muhiview entering');

  this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
    if(this.isEditOpen){
      this.isEditOpen = false;
    }else if(this.isModalOpen){
      this.isModalOpen = false
    }else{
        this.route.navigateByUrl('/home');
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

//   const tool = document.querySelector('.muhtool') as HTMLElement;
//  const list = document.querySelector('.lstmuh') as HTMLElement;
//  const listcont = document.querySelector('.lstcontmuh') as HTMLElement;
//  const cont = document.querySelector('.contmuh') as HTMLElement;
//   const bar = document.querySelector('ion-tab-bar') as HTMLElement;
//   const search = document.querySelector('.barmuh') as HTMLElement;

//   const main = document.querySelector('.mainmuh') as HTMLElement;


//   if(tool && bar && search){


//     const dyHeight = tool.offsetHeight;
//     const barHeight = bar.offsetHeight;
//     const searchHeight = search.offsetHeight;

//     if(dyHeight > 0 && barHeight > 0 && searchHeight > 0){

//       main.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px)`
//       cont.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - ${searchHeight}px - 1rem)`
//       list.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - ${searchHeight}px - 1rem)`
//       listcont.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - ${searchHeight}px -1rem)`
//       this.viewSet = true;


//     }else {
//       console.log('Not enough height');

//     }

//  }

//  }

 ionViewWillLeave(){
  //console.log('Muhi view leaving');

  this.subs.unsubscribe();
 }

getSongs() {
  this.spinner = true;
  this.db.getSong("muhi").subscribe((data)=>{
    //console.log('song entering');
    if(data.length > 0){
      this.anyContent = true;
      this.songs = data;
      //console.log('song', this.songs);
      this.Permsongs = this.songs;
    }else{
      this.anyContent = false;
    }
    this.spinner = false;

  })
}

handleSearch(){
  if(this.searchKey.length > 0){
    this.vis = false;
    this.songs = [];
    this.Permsongs.forEach((s: any)=>{
      if(s.title.includes(this.searchKey) || s.content.includes(this.searchKey)){
        this.songs.push(s);
      }
    })
    //console.log(this.songs.length);
  }else{
    this.vis = true;
    this.songs = this.Permsongs;
  }
}

clearSearch(){
    //console.log('Clicked ', this.Permsongs);
    this.searchKey = '';
}
setOpen(id: boolean){
  this.isModalOpen = id;
  this.isEditOpen = false;
}

ionModalDidDismiss(){
  this.isModalOpen = false;
}

promo(data: any){
  //console.log(data.docid);
  this.currSong = data;
  this.isModalOpen = true;
}

EditSong(data: any){
  this.isEditOpen = true;
  this.editSong.docid = data.docid;
  this.editSong.title = data.title;
  this.editSong.content = data.content;
  this.editSong.author = data.author;
  this.editSong.type = data.type;

}

async deleteSong(data: any){
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
             this.db.deleteFireBase(data).then(()=>{
                  this.spinner = false;
                  this.util.successToast('Song deleted successfully','trash-outline','warning');
              }).catch((er)=>{
                this.spinner = false;
                this.util.erroToast('Something Went Wrong', 'bug-outline');
              });

          }
        }
      ]
    });
    await alert.present();
  }else{
    this.util.NetworkToast();
  }
}

updateSong(){
  //console.log('ready To update');
  //console.log(this.editSong);
  if(this.net){
    this.spinner = true;
    this.isEditOpen = false;

    this.db.updateFireBase(this.editSong).then(()=>{
      this.spinner = false;
      this.util.successToast('Song updated successfully','thumbs-up-outline','success');
    }).catch(er =>{
      this.spinner = false;
      this.util.erroToast('Something Went Wrong', 'bug-outline');
    });
  }else{
    this.util.NetworkToast();
  }
}

onFieldChange(){
  if(this.editSong.content === "" || this.editSong.title === ""){
    this.submitButton = true;
  }else{
    this.submitButton = false;
  }
  }

  redirect(){
    this.route.navigateByUrl('/home');
  }

}
