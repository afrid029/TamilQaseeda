import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper';

SwiperCore.use([EffectCoverflow, Pagination]);

@Component({
  selector: 'app-evidence',
  templateUrl: './evidence.page.html',
  styleUrls: ['./evidence.page.scss'],
})
export class EvidencePage {

  isModalOpen: boolean = false;

  aqAnyContent: boolean = false;
  fiqhAnyContent: boolean =false ;
  othAnyContent: boolean = false;

  isEditOpen: boolean = false;
  submitButton: boolean = false;
  vis: String = "hidden";
  searchKey: String;

  currEvidence: any = {}
  editEvidence: any = {};
  aqeeda : any = [];
  PermAqeeda : any = [];

  fiqh : any = [];
  PermFiqh : any = [];

  other : any = [];
  PermOther : any = [];

  obj: Boolean;
  net: Boolean;
  subs: Subscription;

  spinner: boolean = false;

  constructor(public platform: Platform ,public route: Router,public db: DatabaseService,
   private obsr: ObsrService, public routerOutlet: IonRouterOutlet,
    private utilService: UtillService, public alertctrl: AlertController, public location: PlatformLocation) {


      this.obsr.network.subscribe(re=>{
        this.net=re;
      });

      this.obsr.user.subscribe(re=>{
        this.obj = re;
      })
   }


ionViewWillEnter(){
  //console.log('will Enter');
  this.getEvidence();
}
ionViewDidEnter(){
  //console.log('Evidence view entering');

  this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
    if(this.isEditOpen){
      this.isEditOpen = false;
    }else if(this.isModalOpen){
      this.isModalOpen = false
    }else{
        this.route.navigateByUrl('/dashboard');
      }

  })
 }

 ionViewWillLeave(){
  //console.log('Evidence view leaving');

  this.subs.unsubscribe();
 }

async getEvidence(){
  this.spinner = true;

  return this.db.getEvidence().subscribe((data)=>{
    //console.log('Ziyaram entering ', data);
    this.aqeeda = [];
    this.fiqh = [];
    this.other = [];
    //console.log('evidence entering ', this.aqeeda.length, this.fiqh.length, this.other.length);
    if(data.length > 0){
      let y;
      data.forEach((d: any)=>{
        y = d;

      })
      //console.log(y);

      for(var i=0; i< data.length; i++) {

        if(data[i].type === 'aqeeda'){
          this.aqAnyContent = true;
          this.aqeeda.push(data[i]);
        }else if(data[i].type === 'fikh'){
          this.fiqhAnyContent = true;
          this.fiqh.push(data[i]);
        }else{
          this.othAnyContent = true;
          this.other.push(data[i]);
        }
      }

      this.PermAqeeda = this.aqeeda;
      this.PermFiqh = this.fiqh;
      this.PermOther = this.other;
      //console.log('Evidences ', this.aqeeda, this.fiqh, this.other);

    }
    this.spinner = false;
    if(this.aqeeda.length == 0){
      this.aqAnyContent = false
    }
    if(this.fiqh.length == 0){
      this.fiqhAnyContent = false
    }
    if(this.other.length == 0){
      this.othAnyContent = false
    }


  })

}

setViewModel(val: any){
  this.isModalOpen = val;
}

private slide: any;
setSwiperInstance(event: any){
  //console.log(event.activeIndex);
  this.slide = event
}

promo(data: any){
  //console.log(this.slide.activeIndex);
  this.currEvidence = data;
  this.isModalOpen = true;
}

EditEvidence(data: any){
  // this.editEvidence = data;
  this.editEvidence.docid = data.docid;
  this.editEvidence.title = data.title;
  this.editEvidence.content = data.content;
  this.editEvidence.type = data.type;

  this.isEditOpen = true;
}

setEditFalse(){
  this.isEditOpen = false;
}

update(){

    if(this.net){
      this.spinner = true;
      this.isEditOpen = false;
      this.db.updateEvidenceFireBase(this.editEvidence).then(()=>{
        this.spinner = false;
        this.utilService.successToast('Evidence updated successfully','thumbs-up-outline','success');
      }).catch(er =>{
        this.spinner = false;
        this.utilService.erroToast('Something Went Wrong', 'bug-outline');
      });
    }else{
      this.utilService.NetworkToast();
    }

}

async deleteEvidence(data: any){
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
             this.db.deleteaevidenceFireBase(data).then(()=>{
                this.spinner = false;
                  this.utilService.successToast('Evidence Detail deleted successfully','trash-outline','warning');
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

handleSearch(){
  if(this.searchKey.length > 0){
    this.vis = "visible";
    if(this.slide.activeIndex == 0){
      this.aqeeda = [];
      this.PermAqeeda.forEach((s: any)=>{
        if(s.title.toLowerCase().includes(this.searchKey.toLowerCase())){
          this.aqeeda.push(s);
        }
      })
    }else if(this.slide.activeIndex == 1){
      this.fiqh = [];
      this.PermFiqh.forEach((s: any)=>{
        if(s.title.toLowerCase().includes(this.searchKey.toLowerCase())){
          this.fiqh.push(s);
        }
      })

    }else if(this.slide.activeIndex == 2){
      this.other = [];
      this.PermOther.forEach((s: any)=>{
        if(s.title.toLowerCase().includes(this.searchKey.toLowerCase())){
          this.other.push(s);
        }
      })
    }

  }else{
      this.vis = "hidden";
      this.aqeeda = this.PermAqeeda;
      this.fiqh = this.PermFiqh;
      this.other = this.PermOther;
  }
}

clearSearch(){

    this.searchKey = '';
}


}
