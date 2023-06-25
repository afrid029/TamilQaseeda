import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { last, Subscription } from 'rxjs';

@Component({
  selector: 'app-moulidview',
  templateUrl: './moulidview.page.html',
  styleUrls: ['./moulidview.page.scss'],
})
export class MoulidviewPage implements OnInit {
  pdfSrc: string = ""
  title: String = '';
  subs: Subscription;

  constructor(public active: ActivatedRoute,
    public platform: Platform,public route: Router) {

   }
   ionViewDidEnter(){
    this.active.queryParams.subscribe(params=>{
      if(params && params['source']){
        this.pdfSrc = params['source'];
        let ti = params['source'];
        ti = ti.split('/');
        ti = ti[ti.length - 1];

        ti = ti.substring(0, ti.indexOf('.'));
        console.log(ti);
        this.title = ti;



      }
    })
    console.log('Moulidh view entering');

    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
      this.route.navigateByUrl('/moulids');


    })


   }

   ionViewWillLeave(){
    console.log('Moulidh view leaving');
    this.subs.unsubscribe();
   }

  ngOnInit() {
  }

}
