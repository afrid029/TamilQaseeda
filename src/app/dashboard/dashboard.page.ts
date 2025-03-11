import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AlertController, IonGrid, IonModal, IonRouterOutlet, Platform } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper';
import { Subscription, take } from 'rxjs';
import { RadioServiceService } from '../services/radio-service.service';


SwiperCore.use([EffectCoverflow, Pagination]);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  @ViewChild(IonModal) modal: IonModal;


  obj: Boolean;
  net: Boolean;
  isLoginPageOpen: boolean = false;
  isAddModalOpen: boolean = false;
  submitButton: boolean = true;
  login = {email:'', password:''};
  subs: Subscription;
  player: Subscription;
  banner: boolean = false;
  content: any;
  // viewSet: boolean = false;

  isBlink: boolean = false;

  isPlaying : boolean = true;




  // audioURL: string ="http://streams.radio.co/s937ac5492/listen";
  constructor(public route: Router, public platform: Platform, public routerOutlet: IonRouterOutlet,
    public alertCtrl: AlertController, public db: DatabaseService, public utilService: UtillService,
    public obsr: ObsrService, private render: Renderer2, public radioSrvc : RadioServiceService) {
    this.obsr.network.subscribe(re=>{
      this.net=re;
    });

    this.obsr.user.subscribe(re=>{
      //console.log('User ',re);
      this.obj = re;
    })


    // this.initializeAudio();

   console.log('constructor')
    this.radioSrvc.playStream();

  

   }

  
   ionViewDidEnter(){
    //console.log('view entering');

    

    this.subs = this.platform.backButton.subscribeWithPriority(1,()=>{
      //console.log('Dashboard ',this.constructor.name);
    
        this.toExit();

    });

 
   }

   ngOnInit(): void {
    this.player = this.obsr.isPlaying.subscribe(re => {
      this.isPlaying = re;
      const play = document.getElementById("play") as HTMLDivElement;
      const pause = document.getElementById("pause") as HTMLDivElement;
      if(this.isPlaying) {
        console.log('Playing...');
        
        play.style.display = 'none';
        pause.style.display = 'flex'
      }else {
        console.log('Pausing...');
        play.style.display = 'flex';
        pause.style.display = 'none'
      }
    })

   
   }

   ngOnDestroy(): void {
    
    this.player.unsubscribe(); 
   }


    // audioURL: string ="http://streams.radio.co/s937ac5492/listen";
    radioInterval : any ;
    onAirTitle :  any;
   ionViewWillEnter(){
    const radio = document.getElementById('sonic_title') as HTMLDivElement
    
    this.radioInterval = setInterval(()=> {
      
      const title = radio.innerText;
      if(this.onAirTitle != title){
        const titleArray = title.split('-');
        const onair = document.querySelector('.onair') as HTMLDivElement;
        const onairType = document.querySelector('.onair_type') as HTMLDivElement;
        onair.innerText = titleArray[0];
        onairType.innerText = titleArray[1] ? titleArray[1] : '';
      }
    }, 5000)

   
   this.db.isAnyQna().subscribe({
    next: (result) =>{
     // console.log(result);

     this.isBlink = result;

    },

    error: (err)=>{
      console.log(err);

    }
   })

    let o = this.db.getTodayBannerContent().pipe(take(1));
    o.subscribe((cont: any)=>{
      //  console.log('Contents Count ', cont.length);

         if(cont.length > 0){
          this.banner = true;
          this.content = cont;
          
         }else{
          this.banner = false;
          this.content = "";
         }

     });



   }


   ionViewWillLeave(){
    // console.log('view leaving');

    clearInterval(this.radioInterval);
   
    this.subs.unsubscribe();
   }
   async toExit(){
    //console.log('Can exit noew');
    const alert = await this.alertCtrl.create({
      header: 'Exit ?',
      cssClass: 'al',
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () =>{
            //console.log('cancelld');
            }
        },{
          text: 'Exit',
          role: 'confirm',
          handler: () =>{
            App.exitApp();
          }
        }]
    });
    await alert.present();
  }



  navigateTo(val: any){
    //console.log(val);

    setTimeout(()=>{
      this.route.navigateByUrl(val);

    },10);
    this.isAddModalOpen = false;

  }



  controlRadio(){

    const radio = document.getElementById("radio") as HTMLAudioElement;
    const play = document.getElementById("play") as HTMLDivElement;
    const pause = document.getElementById("pause") as HTMLDivElement;
    const box = document.querySelector('.box2') as HTMLDivElement;
// console.log('Hello');

    if(this.isPlaying) {
      console.log('Hi');
      this.obsr.isPlaying.next(false);
      this.radioSrvc.stopStream();
       
        
    }else {
      console.log('man');
      this.obsr.isPlaying.next(true);
      this.radioSrvc.playStream();
       
        
    }



  }




}
