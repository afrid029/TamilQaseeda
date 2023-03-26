import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';

@Component({
  selector: 'app-add-dua',
  templateUrl: './add-dua.page.html',
  styleUrls: ['./add-dua.page.scss'],
})
export class AddDuaPage implements OnInit {
  @ViewChild('menuModal') modal: IonModal;
  net: boolean = false;
  duas: any = {title:'', content: '', meaning: '', benifit:'', type: '', updatedDate:0, deleted: false};
  typeSelected: boolean = true;
  type: String;
  spinner: boolean= false;

  constructor(private util: UtillService,public datasc: DatabaseService, public obsr: ObsrService,public route: Router) {
    this.obsr.network.subscribe((re)=>{
      this.net = re;
    })
   }

  ngOnInit() {
  }
  setType(menu: String){
    this.duas.type = menu;
    this.modal.dismiss();
    this.typeSelected = false;
    if(menu === 'dua'){
      this.type = 'துஆ'
    }
    if(menu === 'salawat'){
      this.type = 'ஸலவாத்து'
    }

  }

  submit(form: NgForm){
    if(this.net){
      this.spinner = true;
      this.duas.updatedDate = new Date().getTime();
      console.log(this.duas);


      this.datasc.addDuaDetail(this.duas).then(async (data: any) => {
        this.spinner = false;
        this.route.navigateByUrl('dashboard');
        this.duas = {};
        form.resetForm();
        this.util.successToast('Successfully Added','cloud-upload-sharp','warning')
      }).catch((er: any)=>{
        this.spinner = false;
        console.log('Error encountered ', er.message);
        this.util.erroToast(er.message, 'snow-outline');
      })
    }else{

      this.util.NetworkToast();
    }

  }

}
