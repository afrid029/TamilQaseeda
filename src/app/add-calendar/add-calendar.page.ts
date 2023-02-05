import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';

@Component({
  selector: 'app-add-calendar',
  templateUrl: './add-calendar.page.html',
  styleUrls: ['./add-calendar.page.scss'],
})
export class AddCalendarPage implements OnInit {
  calendar: any = {date:'', content: '', updatedDate:0, deleted: false};
  net: Boolean;

  constructor(public datasc: DatabaseService, public util: UtillService, public obsr: ObsrService){
    this.obsr.network.subscribe((re)=>{
      this.net = re;
    })
   }

  ngOnInit() {
  }
  submit(){
    if(this.net){
      this.calendar.updatedDate = new Date().getTime();

      this.datasc.addCalendarDetail(this.calendar).then(async (re: any)=>{
        this.calendar = {date:'', content: '', updatedDate:0, deleted: false};
        this.util.successToast('Calendar Detail Successfully Added','cloud-upload-sharp','warning')
      }).catch((er: any)=>{
        this.util.erroToast(er.message, 'snow-outline'); 
      })

    }else{
      this.util.NetworkToast();
    }
  }

}
