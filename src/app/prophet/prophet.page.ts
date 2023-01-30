import { Component } from '@angular/core';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { PlatformLocation } from '@angular/common';
import { UtillService } from '../services/utill.service';

@Component({
  selector: 'app-prophet',
  templateUrl: './prophet.page.html',
  styleUrls: ['./prophet.page.scss'],
})
export class ProphetPage {
  isModalOpen: boolean = false;
  anyContent: boolean = false;
  isEditOpen: boolean = false;
  submitButton: boolean = false;
  vis: String = "hidden";
  searchKey: String;
  songs : any = [];
  Permsongs : any = [];
  currSong : any = {};
  editSong : any = {};
  obj: boolean;
  net: boolean;
  subs: Subscription;
  constructor(public db: DatabaseService, public obs: ObsrService, public platform: Platform, public routerOutlet: IonRouterOutlet, public location: PlatformLocation, public util: UtillService, public alertctrl: AlertController,
    public obsr: ObsrService) {

    this.obsr.network.subscribe(re=>{
      this.net=re;
    });
  
    this.subs = this.platform.backButton.subscribeWithPriority(100,()=>{
        if(this.routerOutlet.canGoBack()){
          if(!this.isEditOpen && !this.isModalOpen){
            this.unsbr();
            this.location.back();
            console.log('helloww');
          }
        }
    })
    if(localStorage.getItem('user')){
      console.log("set");
      this.obj = true;
      
    }else{
      console.log("unset");
      this.obj = false;
      
    }
}
unsbr(){
  this.subs.unsubscribe();
}

ionVieWillLoad() {
    console.log('will load');
}

ionViewWillEnter(){
  console.log('will Enter');
  this.getSongs();
}

async getSongs() {
  this.db.getSong("prophet").then((data)=>{
    console.log('song entering');
    this.songs = [];
    console.log('song entering', this.songs.length);
    if(data.rows.length > 0){
      this.anyContent = true;
      for(var i=0; i< data.rows.length; i++) {
        this.songs.push(data.rows.item(i));
      }
      console.log('song', this.songs);
      this.Permsongs = this.songs;
    }else{
      this.anyContent = false;
    }
    
  }).catch((e)=>{
    console.log(e);
    })
}
  
handleSearch(){
  if(this.searchKey.length > 0){
    this.vis = "visible";
    this.songs = [];
    this.Permsongs.forEach((s: any)=>{
      if(s.title.startsWith(this.searchKey)){
        this.songs.push(s);
      } 
    })
    console.log(this.songs.length);
  }else{
    this.vis = "hidden";
    this.songs = this.Permsongs;
  }
}
 
clearSearch(){
    console.log('Clicked ', this.Permsongs);
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
  console.log(data.docid);
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
  this.editSong.deleted = false;
  this.editSong.updatedDate = data.updatedDate;  
}

async deleteSong(data: any){
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
            console.log('delete Conformed');
             this.db.deleteFireBase(data).then(()=>{
                  this.util.successToast('Song deleted successfully','trash-outline','warning');
              }).catch((er)=>{
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
  console.log('ready To update');
  console.log(this.editSong);
  if(this.net){
    this.editSong.updatedDate = new Date().getTime();
    this.db.updateFireBase(this.editSong).then(()=>{
      this.isEditOpen = false;
      this.util.successToast('Song updated successfully','thumbs-up-outline','success');
    }).catch(er =>{
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

}
