import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { AlertController, IonModal, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';

SwiperCore.use([EffectCoverflow, Pagination]);

@Component({
  selector: 'app-dua',
  templateUrl: './dua.page.html',
  styleUrls: ['./dua.page.scss'],
})
export class DuaPage implements OnInit {
  subs: Subscription;
  obj: Boolean;
  net: Boolean;
  spinner: boolean = false;

  searchKey: String;
  vis: String = "hidden";

  isModalOpen: boolean = false;
  isEditOpen: boolean = false;
  duaAnyContent: boolean = false;
  salAnyContent: boolean =false; 
  currAwraath: any = {}
  editAwraath: any = {};

  dua: any = [];
  PermDua: any = [];

  salawat: any = [];
  PermSalawat: any = []; 

  constructor(private platform: Platform, private obsr: ObsrService, private router: Router, private db: DatabaseService, private utilService: UtillService, private alertctrl: AlertController) { 
    this.obsr.network.subscribe(re=>{
      this.net =re;
    });
    
    this.obsr.user.subscribe(re=>{
      this.obj =re;
    })
  }
  ionViewWillEnter(){
    console.log('will Enter');
   this.getDua();
  }

  ionViewDidEnter(){
    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
      if(this.isEditOpen){
        this.isEditOpen = false;
      }else if(this.isModalOpen){
        this.isModalOpen = false
      }else{
          this.router.navigateByUrl('/dashboard');
        }
      
    })
  }
  ionViewWillLeave(){
    this.subs.unsubscribe();
  }

  ngOnInit() {
  }

  async getDua(){
    this.spinner = true;
  
    return this.db.getDuas().then((data)=>{
      console.log('Dua entering ', data);
      this.dua = [];
      this.salawat = [];
  
      console.log('Dua entering ', this.dua.length, this.salawat.length);
      if(data.rows.length > 0){
        
        for(var i=0; i< data.rows.length; i++) {
          
          if(data.rows.item(i).type === 'dua'){
            this.duaAnyContent = true;
            this.dua.push(data.rows.item(i));
          }else{
            this.salAnyContent = true;
            this.salawat.push(data.rows.item(i));
          }
        }
  
        this.PermDua = this.dua;
        this.PermSalawat = this.salawat;
      
        console.log('Duas ', this.dua, this.salawat);
        
      }
      this.spinner = false;
      if(this.dua.length == 0){
        this.duaAnyContent = false
      }
      if(this.salawat.length == 0){
        this.salAnyContent = false
      }
      
      
      
    }).catch((e)=>{
      console.log(e);
      this.spinner = false;
      this.utilService.erroToast(e,'analytics-outline');
      })
  
  }

  async handleRefresh(event: any) {
  
    if(this.net){
      this.spinner = true
      setTimeout(() => {
        this.db.getDuaFromFireBase();
        console.log('refreshed ');
        event.target.complete();
      }, 2000);
  
      setTimeout(()=>{
       this.getDua();
        this.spinner = false;
      },4000)
          
    }else{
      event.target.complete();
      this.utilService.NetworkToast();
    }
  }
  private slide: any;
setSwiperInstance(event: any){
  console.log(event.activeIndex);
  this.slide = event
}

handleSearch(){
  if(this.searchKey.length > 0){
    this.vis = "visible";
    if(this.slide.activeIndex == 0){
      this.dua = [];
      this.PermDua.forEach((s: any)=>{
        if(s.title.toLowerCase().includes(this.searchKey.toLowerCase())){
          this.dua.push(s);
        }
      })
    }else if(this.slide.activeIndex == 1){
      this.salawat = [];
      this.PermSalawat.forEach((s: any)=>{
        if(s.title.toLowerCase().includes(this.searchKey.toLowerCase())){
          this.salawat.push(s);
        }
      })

    }
    
  }else{
      this.vis = "hidden";
      this.dua = this.PermDua;
      this.salawat = this.PermSalawat;
      
  }
}

clearSearch(){
  // console.log('Clicked ', this.Permevidence);
  this.searchKey = ''; 
}

setViewModel(state: boolean){
  this.isModalOpen = state;
}
setEditModel(state: boolean){
  if(!state){
    this.dua = this.PermDua;
    this.salawat = this.PermSalawat;
  }
  this.isEditOpen = state;

}

promo(data: any){
  this.currAwraath = data;
  this.setViewModel(true);
}

Title: String;

editDetail(data: any){
  this.editAwraath = data;
  // this.Title = data.title;
  // this.editAwraath.content = data.content;
  // this.editAwraath.meaning = data.meaning;
  // this.editAwraath.benifit = data.benifit;
  // this.editAwraath.type = data.type;
  this.setEditModel(true);
}
async deleteAwrath(data: any){
  if(this.net){
    const alert = await this.alertctrl.create({
      header: 'Are You Sure To Delete',
      cssClass: 'delAlert',
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
            console.log('delete Confirmed');
             this.db.deleteDuaFireBase(data).then(()=>{
                this.spinner = false;
                  this.utilService.successToast('Deleted successfully','trash-outline','warning');
              }).catch((er)=>{
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

update(){
  if(this.net){
    this.spinner = true;
    this.isEditOpen = false;
    this.editAwraath.updatedDate = new Date().getTime();
    this.editAwraath.deleted = false;
    this.db.updateDuaFireBase(this.editAwraath).then(()=>{
      this.spinner = false;
      this.utilService.successToast('Updated successfully','thumbs-up-outline','success');
    }).catch(er =>{
      this.spinner = false;
      this.utilService.erroToast('Something Went Wrong', 'bug-outline');
    });
  }else{
    this.utilService.NetworkToast();
  }
}


}
