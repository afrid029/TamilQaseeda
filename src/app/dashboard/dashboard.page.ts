import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
export class DashboardPage  {
  @ViewChild(IonModal) modal: IonModal;


  obj: Boolean;
  net: Boolean;
  isLoginPageOpen: boolean = false;
  isAddModalOpen: boolean = false;
  submitButton: boolean = true;
  login = {email:'', password:''};
  subs: Subscription;
  banner: boolean = false;
  content: any;
  viewSet: boolean = false;

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

    this.obsr.isPlaying.subscribe(re => {
      this.isPlaying = re;
    })

    // this.initializeAudio();

    this.radioSrvc.playStream();

  

   }

  
  //  async initializeAudio() {
  //   try {
  //     // Preload the audio

  //     const liveStreamUrl = 'https://sonic-ca.instainternet.com/assunnahtamil/stream'; // Example of HLS URL

  //      this.player = new Howl({
  //       src: [liveStreamUrl],
  //       html5: true,
  //       format: ['mp3', 'aac'],
  //       onend: () => {
  //         console.log('Stream ended');
  //       },
  //       onloaderror: (id, error) => {
  //         console.error('Load error', error);
  //       },
  //       onplayerror: (id, error) => {
  //         console.error('Play error', error);
  //       }
  //     });
      
  //     // this.player.play();
  //     // Initialize and play the live stream
  //     // const audio = AudioPlugin.playList(liveStreamUrl)

      
  //     console.log('Live Audio Streaming Started');

  //   //   await NativeAudio.preload({
  //   //     assetId: "Radio",
  //   //     assetPath: "https://sonic-ca.instainternet.com/assunnahtamil/stream",
  //   //     audioChannelNum: 1,
  //   //     isUrl: true
  //   // });
  //     // console.log('Audio Preloaded');
      
  //     // Automatically play the audio after it is preloaded
  //     // await this.controlRadio();
      
  //   } catch (error) {
  //     console.error('Error preloading and autoplaying audio', error);
  //   }
  // }

   ionViewDidEnter(){
    //console.log('view entering');
    this.subs = this.platform.backButton.subscribeWithPriority(1,()=>{
      //console.log('Dashboard ',this.constructor.name);

        this.toExit();

    });

    const loading = setInterval(()=>{
      this.UpdateCss();
      if(this.viewSet){
        clearInterval(loading);
      }
    },1000);
    this.UpdateCss();
   }

   UpdateCss(){

      const banner = document.querySelector('.img1') as HTMLElement;
      const audio = document.querySelector('.box2') as HTMLElement;
    const grid = document.querySelector('.dgrid') as HTMLElement;
    const bar = document.querySelector('ion-tab-bar') as HTMLElement;

    if(banner && grid && audio){
      // console.log('viewd');

      const bannerHeight = banner.offsetHeight;
      const audioHeight = audio.offsetHeight;
      const barHeight = bar.offsetHeight;
      // console.log(bannerHeight);
      //   console.log(audioHeight);
      //   console.log(barHeight);

      if(bannerHeight > 0 && audioHeight > 0 && barHeight > 0) {
        grid.style.height = `calc(100vh - 8vh - 8px - ${barHeight}px - ${audioHeight}px - ${bannerHeight}px)`
        grid.style.maxHeight = `calc(100vh - 8vh - 8px - ${barHeight}px - ${audioHeight}px - ${bannerHeight}px)`
        // console.log(bannerHeight);
        // console.log(audioHeight);

        this.viewSet = true;

      }else {
        console.log('Not enough height');

      }



   }

   }

    // audioURL: string ="http://streams.radio.co/s937ac5492/listen";
   ionViewWillEnter(){

    
    // const radio = document.getElementById("radio") as HTMLAudioElement;

    // const radioCheck = setInterval(() => {
    //   if(radio) {
    //     console.log('checking');
    //     if(radio.paused){
    //       this.controlRadio();
    //     }
       
    //     clearInterval(radioCheck);
    //   }
    // }, 1000)

    // radio.setAttribute('src', this.audioURL);
   
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
          // for(let z = 0; z < cont.length; z++){
          //   this.content = this.content.concat("       ", cont[z].content);
          //   console.log(cont[z]);

          // }

          // console.log(this.content);

          //  console.log(cont.length);
          //  this.alerts = cont;
          //  this.length = cont.length;
          //  this.openModal(true);
         }else{
          this.banner = false;
          this.content = "";
         }

     });



   }


   ionViewWillLeave(){
    //console.log('view leaving');

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



  async controlRadio(){

    const radio = document.getElementById("radio") as HTMLAudioElement;
    const play = document.getElementById("play") as HTMLDivElement;
    const pause = document.getElementById("pause") as HTMLDivElement;
    const box = document.querySelector('.box2') as HTMLDivElement;
// console.log('Hello');

    if(this.isPlaying) {
      // console.log('Hi');
      this.radioSrvc.stopStream();
        play.style.display = 'block';
        pause.style.display = 'none';
        this.obsr.isPlaying.next(false);
    }else {
      // console.log('man');
      this.radioSrvc.playStream();
        play.style.display = 'none';
        pause.style.display = 'block';
        this.obsr.isPlaying.next(true);
    }

    // NativeAudio.isPlaying({assetId: 'Radio'}).then(res => {
    //   if(res.isPlaying) {

    //     NativeAudio.pause({assetId: 'Radio'});
    //     play.style.display = 'block';
    //     pause.style.display = 'none';
    //   } else {
    //     NativeAudio.play({assetId: 'Radio'});
    //     play.style.display = 'none';
    //     pause.style.display = 'block';
    //   }
    // })

    // if(NativeAudio.isPlaying({assetId: 'radio'})) {
    //   radio.play();
    //   play.style.display = 'none';
    //   pause.style.display = 'block';


    // }else {
    //   radio.pause();
    //   play.style.display = 'block';
    //   pause.style.display = 'none';
    // }

    // var options: StreamingAudioOptions = {
    //   initFullscreen: false,

    // }


    // //console.log(this.audioURL);

    // this.stream.playAudio("https://sonic-ca.instainternet.com/8020/stream", options)

  }




}
