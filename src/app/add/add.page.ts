import { Component } from '@angular/core';
import { AngularFireList } from '@angular/fire/compat/database';
import {DatabaseService} from '../services/database.service';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})

export class AddPage {
  databaseObj: SQLiteObject;
  song: any = {title:'',content:'',author:'',type:'',updatedDate:0, deleted: false};
  value: any = [{}];
  document: AngularFireList<any>;
  len: number;
  net: Boolean;
  chk: any;

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
  submit(){
    if(this.net){
      this.song.updatedDate = new Date().getTime();
      console.log(this.song);
    
      this.db.sendToFirebase(this.song).then(async (re: any)=>{
        console.log(re);
        this.song = {title:'',content:'',author:'',type:'', updatedDate:0, deleted: false};
        this.util.successToast('Song Successfully Added','cloud-upload-sharp','warning')
            
      }).catch((e: any)=>{
          console.log('Error encountered ', e.message);   
          this.util.erroToast(e.message, 'snow-outline');  
      });
    }else{
        this.util.NetworkToast();
      }   
  }

 

}
