import { Component, ViewChild } from '@angular/core';
import { AngularFireList } from '@angular/fire/compat/database';
import {DatabaseService} from '../services/database.service';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonModal, ToastController } from '@ionic/angular';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})


export class AddPage {
  @ViewChild(IonModal)
  modal : IonModal;

  song: any = {title:'',content:'',author:'',type:'',vali: '',updatedDate:0, deleted: false};
  net: Boolean;
  type: string;
  typeSelected: boolean = true;

  spinner: boolean = false;

  constructor(private db: DatabaseService, private sqlite: SQLite,
    public afs: AngularFirestore,
    public obsr: ObsrService,
    private router: Router,
    private toast:ToastController,
    public util: UtillService) {

      this.obsr.network.subscribe(re=>{
        this.net = re;
      })

   }
  submit(form: NgForm){
    if(this.net){
      this.spinner = true;
      this.song.updatedDate = new Date().getTime();
      console.log(this.song);

      this.db.sendToFirebase(this.song).then(async (re: any)=>{
        console.log(re);
        this.spinner = false;
        this.router.navigateByUrl('dashboard')
        this.song = {};
        this.type = "";
        form.resetForm();
        this.util.successToast('Song Successfully Added','cloud-upload-sharp','warning')

      }).catch((e: any)=>{
        this.spinner = false;
          console.log('Error encountered ', e.message);
          this.util.erroToast(e.message, 'snow-outline');
      });
    }else{
        this.util.NetworkToast();
      }
  }


  setTypeVal(val: any){
    this.modal.dismiss();
    this.song.type = val;
    this.typeSelected = false;
    if(val === 'prophet'){
      this.type = 'முஹம்மது ஸல்லல்லாஹு அலைஹி வஸல்லம்'
    }
    if(val === 'muhi'){
      this.type = 'முஹியித்தீன் அப்துல் காதிர் ஜீலானி கத்தஸல்லாஹுஸ்ஸிர்ரஹுல் அஸீஸ்'
    }
    if(val === 'shahul'){
      this.type = 'ஷாஹுல் ஹமீது நாயகம் கத்தஸல்லாஹுஸ்ஸிர்ரஹுல் அஸீஸ்'
    }
    if(val === 'ajmeer'){
      this.type = 'ஹாஜா நாயகம் கத்தஸல்லாஹுஸ்ஸிர்ரஹுல் அஸீஸ்'
    }if(val === 'other'){
      this.type = 'other'
    }

  }



}
