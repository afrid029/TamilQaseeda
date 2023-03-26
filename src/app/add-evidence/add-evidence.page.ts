import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';

@Component({
  selector: 'app-add-evidence',
  templateUrl: './add-evidence.page.html',
  styleUrls: ['./add-evidence.page.scss'],
})
export class AddEvidencePage implements OnInit {
  @ViewChild('menuModal') modal: IonModal;

  evidence: any = {title:'',content:'',type:'', updatedDate:0, deleted: false}
  net: Boolean;
  spinner: boolean = false;
  menu: string;
  menuSelected: boolean = true;

  constructor(public datasc: DatabaseService, public util: UtillService, public obsr: ObsrService,public route: Router) {
    this.obsr.network.subscribe((re)=>{
      this.net = re;
    })
   }

  ngOnInit() {
  }

  submit(form: NgForm){
    if(this.net){
      this.spinner = true;
      this.evidence.updatedDate = new Date().getTime();
      console.log(this.evidence);


      this.datasc.addEvidenceDetail(this.evidence).then(async (data: any) => {
        this.spinner = false;
        this.route.navigateByUrl('dashboard');
        this.evidence = {};
        form.resetForm();
        this.util.successToast('Evidence Successfully Added','cloud-upload-sharp','warning')
      }).catch((er: any)=>{
        this.spinner = false;
        console.log('Error encountered ', er.message);
        this.util.erroToast(er.message, 'snow-outline');
      })
    }else{

      this.util.NetworkToast();
    }

  }

  setMenu(menu: String){
    this.evidence.type = menu;
    this.modal.dismiss();
    this.menuSelected = false;
    if(menu === 'aqeeda'){
      this.menu = 'அகீதா'
    }
    if(menu === 'fikh'){
      this.menu = 'பிஃக்ஹ்'
    }
    if(menu === 'other'){
      this.menu = 'ஏனையவை'
    }
  }

}
