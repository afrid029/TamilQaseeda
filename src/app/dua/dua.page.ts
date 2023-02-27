import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ObsrService } from '../services/obsr.service';

@Component({
  selector: 'app-dua',
  templateUrl: './dua.page.html',
  styleUrls: ['./dua.page.scss'],
})
export class DuaPage implements OnInit {
  subs: Subscription;
  obj: Boolean;
  net: Boolean;

  constructor(private platform: Platform, private obsr: ObsrService, private router: Router) { 
    this.obsr.network.subscribe(re=>{
      this.net =re;
    });
    
    this.obsr.user.subscribe(re=>{
      this.obj =re;
    })
  }

  ionViewDidEnter(){
    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
      this.router.navigateByUrl('/dashboard');
    })
  }
  ionViewWillLeave(){
    this.subs.unsubscribe();
  }

  ngOnInit() {
  }

}
