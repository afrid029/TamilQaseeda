import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { ObsrService } from 'src/app/services/obsr.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UtillService } from '../services/utill.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.page.html',
  styleUrls: ['./google-map.page.scss'],
})
export class GoogleMapPage implements OnInit {

  @ViewChild('map')
  mapRef!: ElementRef<HTMLIonModalElement>;
  newMap!: GoogleMap;

  net: boolean = false;
  loc:any;
  id: any;
  clicked:boolean = false;
  select: boolean = false;
  test: boolean = false;
  interval: any;
  subs: Subscription;

  val: string = "hiii";

  constructor(public obsr: ObsrService, public router: Router, public location: Location, public utill: UtillService, public platform: Platform) {

   }
   ionViewDidEnter(){
    console.log('Map view entering');

    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
      //  this.location.back();
      //  this.clearMap()

    })
   }
   clearMap(){
    this.obsr.LocSelected.next(false);
    this.obsr.MapClicked.next(false);
    this.obsr.latitude.next(-1);
    this.obsr.longtitude.next(-1);
 }

   ionViewWillLeave(){
    console.log('Map view leaving');
    if(this.newMap){
      this.newMap.destroy();
    }

    this.subs.unsubscribe();
   }

  ngOnInit() {
    this.obsr.MapClicked.subscribe((re)=>{
      this.clicked = re;
    });
    this.obsr.network.subscribe((re)=>{
      this.net = re;
    })
    this.obsr.LocSelected.subscribe((re)=>{
      this.select = re;
    })
  }
  ngAfterViewInit() {
    this.interval = setInterval(()=>{
      if(this.select){
        this.test = true;
      }else{
        this.test = false;
      }
      console.log(this.val);

    },1000)

    this.myLoc().then((re)=>{
      console.log(re);

      this.viewMap();
    }).catch((er)=>{
      console.log(er);
      clearInterval(this.interval);
      this.location.back();
      this.utill.erroToast('Allow Location Service In Settings','./../../assets/icon/map-location-solid.svg')

    });
    // setTimeout(()=>{

    // },2000)
  }
    async myLoc(){
       this.loc = await Geolocation.getCurrentPosition({enableHighAccuracy: true});
       console.log(this.loc);


      }

      async viewMap(){

        this.newMap = await GoogleMap.create({
          id: 'my-cool-map',
          element: this.mapRef.nativeElement,
          apiKey: 'AIzaSyBWTpiUf6Zbjzcu2hEOSgrPMYVCQ7VPWIw',
          config: {
            center: {
              lat: this.loc.coords.latitude,
              lng: this.loc.coords.longitude
            },
            zoom: 12,
          },
        });

    

        if(this.obsr.latitude.getValue() !== -1 && this.obsr.longtitude.getValue() !== -1){
          const markerId1 = await this.newMap.addMarker(
            {
                coordinate: {
                  lat: this.obsr.latitude.getValue(),
                  lng: this.obsr.longtitude.getValue()
                },
                tintColor : {
                  r:0,
                  g:24,
                  b:24,
                  a:1
                },
                title: 'Selected Location'
            }
          );

          this.id = markerId1;
          this.obsr.MapClicked.next(true);
          console.log('jnjbjh');

        }

        const markerId = await this.newMap.addMarker(
          {
              coordinate: {
                lat: this.loc.coords.latitude,
                lng: this.loc.coords.longitude
              },
              tintColor : {
                r:235,
                g:135,
                b:52,
                a:1
              },
              title: 'My Location'
          }
        );
        console.log(this.obsr.latitude.value);

        this.newMap.setOnMapClickListener(async (re)=>{
          console.log(re);
          if(this.clicked){
            await this.newMap.removeMarker(this.id);
          }
          const myMark = await this.newMap.addMarker({
            coordinate:{
              lat: re.latitude,
              lng: re.longitude
            },
            title: 'Selected Location'
          });
          this.obsr.LocSelected.next(true);
          this.obsr.MapClicked.next(true);
          this.id = myMark;
          console.log(myMark);

          this.obsr.latitude.next(re.latitude);
          this.obsr.longtitude.next(re.longitude);
        })

  }


  goprev(){
    document.documentElement.style.setProperty(`--ion-background-color`, 'white')
    //this.newMap.destroy();
    this.obsr.LocSelected.next(false);
    this.obsr.MapClicked.next(false);
    this.obsr.latitude.next(-1);
    this.obsr.longtitude.next(-1);
    //this.newMap.removeAllMapListeners();
   this.router.navigateByUrl('add-ziyaram');
    //this.location.back();
    clearInterval(this.interval);
  }

  goFurther(check: boolean){
   // this.newMap.destroy();
    //document.documentElement.style.setProperty(`--ion-background-color`, 'white')
    if(check){
      this.obsr.latitude.next(this.loc.coords.latitude);
      this.obsr.longtitude.next(this.loc.coords.longitude);
      this.obsr.LocSelected.next(true);
      this.obsr.MapClicked.next(true);
    }
    this.router.navigateByUrl('add-ziyaram');
    //this.location.back();
    clearInterval(this.interval);
  }

  async clearLoc(){
    this.obsr.LocSelected.next(false);
    this.obsr.MapClicked.next(false);
    await this.newMap.removeMarker(this.id);

  }

}
