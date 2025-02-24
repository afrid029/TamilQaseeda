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
  vis: boolean = true;
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

  viewSet: boolean = false;

  isAqeeda: boolean = false;
  isSunnath: boolean = false;
  isOther: boolean = false;
  opened: boolean = false;
  rendered: boolean = false;
  contentFetched: boolean = false;


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
  this.isAqeeda = false;
  this.isSunnath = false;
  this.isOther = false;
  this.opened = false;
  this.rendered = false;
  this.contentFetched = false;

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

  const loading = setInterval(()=>{
    this.updateCss();
    if(this.viewSet){
      clearInterval(loading);
    }
  },1000);

 }

 updateCss(){

  const tool = document.querySelector('.evitool') as HTMLElement;
const list = document.querySelector('.lstevi') as HTMLElement;
 //const content = document.querySelector('.content') as HTMLElement;
 const smallTile = document.querySelector('.smallTile') as HTMLElement;
 //const bigTile = document.querySelector('.bigTile') as HTMLElement;
//  const listcont = document.querySelector('.lstcontziy') as HTMLElement;
//  const cont = document.querySelector('.contziy') as HTMLElement;
  const bar = document.querySelector('ion-tab-bar') as HTMLElement;
  // const search = document.querySelector('.barziy') as HTMLElement;
  //const swiper = document.querySelector('.swiper') as HTMLElement;
  //const lines = document.querySelectorAll('.line') as NodeListOf<HTMLElement>

  // const main = document.querySelector('.mainziy') as HTMLElement;


  if(tool && bar){


    const dyHeight = tool.offsetHeight;
    const barHeight = bar.offsetHeight;
    const sTile = smallTile.offsetHeight;
    //const bTile = bigTile.offsetHeight;
    // const searchHeight = search.offsetHeight;
    // console.log(sTile);




    if(dyHeight > 0 && barHeight > 0 && sTile > 0){

      // main.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px)`
      // cont.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - ${searchHeight}px - 1rem)`
      list.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - 1rem)`

      // lines.forEach(line => {
      //   line.style.width = `calc(100vw - 7rem)`
      // })
      // content.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - ${sTile}px - ${sTile}px)`
      // bigTile.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - ${sTile}px - ${sTile}px + 3rem)`
      // listcont.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - ${searchHeight}px -1rem)`
      //swiper.style.height = `85vh`
      this.viewSet = true;



    }else {
      console.log('Not enough height');

    }

 }

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

handleSearch(val: string){
  if(this.searchKey.length > 0){
    this.vis = false;
    if(val == 'a'){
      this.aqeeda = [];
      this.PermAqeeda.forEach((s: any)=>{
        if(s.title.toLowerCase().includes(this.searchKey.toLowerCase()) || s.content.toLowerCase().includes(this.searchKey.toLowerCase())){
          this.aqeeda.push(s);
        }
      })
    }else if(val == 's'){
      this.fiqh = [];
      this.PermFiqh.forEach((s: any)=>{
        if(s.title.toLowerCase().includes(this.searchKey.toLowerCase()) || s.content.toLowerCase().includes(this.searchKey.toLowerCase())){
          this.fiqh.push(s);
        }
      })

    }else if(val == 'o'){
      this.other = [];
      this.PermOther.forEach((s: any)=>{
        if(s.title.toLowerCase().includes(this.searchKey.toLowerCase()) || s.content.toLowerCase().includes(this.searchKey.toLowerCase())){
          this.other.push(s);
        }
      })
    }

  }else{
      this.vis = true;
      this.aqeeda = this.PermAqeeda;
      this.fiqh = this.PermFiqh;
      this.other = this.PermOther;
  }
}

clearSearch(){
    console.log('Deleted');

    this.searchKey = '';
}

viewArticles(value: string){
  this.clearSearch();
  this.handleSearch('refresh')
  if(value === 'a'){
    this.isAqeeda = !this.isAqeeda
    this.isSunnath = false;
    this.isOther = false;

    this.contentFetched = this.aqAnyContent;
  }else if(value === 's'){
    this.isSunnath = !this.isSunnath
    this.isAqeeda = false;
    this.isOther = false;

    this.contentFetched = this.fiqhAnyContent;
  }else if(value === 'o'){
    this.isOther =!this.isOther
    this.isAqeeda = false;
    this.isSunnath = false;

    this.contentFetched = this.othAnyContent;
  }

  this.opened = this.isAqeeda || this.isSunnath || this.isOther;

  if(this.opened && this.contentFetched){
    const rendaring = setInterval(()=>{
      this.RendarCss();
      if(this.rendered){
        // console.log('rendered');
        clearInterval(rendaring);
      }
    },1000);
  }

}

RendarCss(){

  const tool = document.querySelector('.evitool') as HTMLElement;
const list = document.querySelector('.lstevi') as HTMLElement;
 //const content = document.querySelector('.content') as HTMLElement;
 const smallTile = document.querySelector('.smallTile') as HTMLElement;
 const bigTile = document.querySelector('.bigTile') as HTMLElement;
//  const listcont = document.querySelector('.lstcontziy') as HTMLElement;
//  const cont = document.querySelector('.contziy') as HTMLElement;
  const bar = document.querySelector('ion-tab-bar') as HTMLElement;
  // const search = document.querySelector('.barziy') as HTMLElement;
  //const swiper = document.querySelector('.swiper') as HTMLElement;

  // const main = document.querySelector('.mainziy') as HTMLElement;


  if(tool && bar){


    const dyHeight = tool.offsetHeight;
    const barHeight = bar.offsetHeight;
    const sTile = smallTile.offsetHeight;
    //const bTile = bigTile.offsetHeight;
    // const searchHeight = search.offsetHeight;
    // console.log(sTile);




    if(dyHeight > 0 && barHeight > 0 && sTile > 0){

      // main.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px)`
      // cont.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - ${searchHeight}px - 1rem)`
      //list.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - 1rem)`
      //content.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - ${sTile}px - ${sTile}px)`
      bigTile.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - ${sTile}px - ${sTile}px + 3rem)`
      // listcont.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px - ${searchHeight}px -1rem)`
      //swiper.style.height = `85vh`
      this.rendered = true;



    }else {
      console.log('Not enough height');

    }

 }

 }


}
