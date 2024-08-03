import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { ObsrService } from 'src/app/services/obsr.service';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements OnInit {

  @ViewChild('map')
  mapRef!: ElementRef<HTMLIonModalElement>;
  newMap!: GoogleMap;

  loc:any;
  id: any;
  clicked:boolean = false;
  constructor(public obsr: ObsrService) {
    this.obsr.MapClicked.subscribe(re=>{
      this.clicked = re;
    })
   }

  ngOnInit() {}
  ngAfterViewInit() {
    this.myLoc();
    setTimeout(()=>{
      this.viewMap();
    },2000)
  }

  async myLoc(){
    this.loc = await Geolocation.getCurrentPosition();
    //console.log(this.loc);
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

    const markerId = await this.newMap.addMarker(
      {
          coordinate: {
            lat: this.loc.coords.latitude,
            lng: this.loc.coords.longitude
          },
          tintColor : {
            r:0,
            g:24,
            b:24,
            a:1
          },
          title: 'My Location'
      }
    );
    //console.log(this.obsr.latitude.value);


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
    }


    this.newMap.setOnMapClickListener(async (re)=>{
      //console.log(re);
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
      //console.log(myMark);

      this.obsr.latitude.next(re.latitude);
      this.obsr.longtitude.next(re.longitude);
    })
  }

}
