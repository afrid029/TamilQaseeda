import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';

@Component({
  selector: 'app-add-evidence',
  templateUrl: './add-evidence.page.html',
  styleUrls: ['./add-evidence.page.scss'],
})
export class AddEvidencePage implements OnInit {

  evidence: any = {title:'',content:'',type:'', updatedDate:0, deleted: false}
  net: Boolean;
  spinner: boolean = false;

  constructor(public datasc: DatabaseService, public util: UtillService, public obsr: ObsrService,public route: Router) {
    this.obsr.network.subscribe((re)=>{
      this.net = re;
    })
   }

  ngOnInit() {
  }

  submit(){
    if(this.net){
      this.spinner = true;
      this.evidence.updatedDate = new Date().getTime();
      
      this.datasc.addEvidenceDetail(this.evidence).then(async (data: any) => {
        this.spinner = false;
        this.route.navigateByUrl('dashboard');
        this.evidence = {title:'',content:'',type:'', updatedDate:0, deleted: false}
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

}
