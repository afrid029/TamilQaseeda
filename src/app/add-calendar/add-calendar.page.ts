import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';

@Component({
  selector: 'app-add-calendar',
  templateUrl: './add-calendar.page.html',
  styleUrls: ['./add-calendar.page.scss'],
})
export class AddCalendarPage implements OnInit {
  calendar: any = {date:'', content: '', isl: ''};
  net: Boolean;
  spinner: boolean = false;
  constructor(public datasc: DatabaseService, public util: UtillService, public obsr: ObsrService, public route: Router){
    this.obsr.network.subscribe((re)=>{
      this.net = re;
    })
   }

  ngOnInit() {
  }
  submit(form: NgForm){
    if(this.net){
      this.spinner = true;
      console.log(this.calendar);


      this.datasc.addCalendarDetail(this.calendar).then(async (re: any)=>{
        this.spinner = false;
        this.route.navigateByUrl('dashboard');
        this.calendar = {};
        form.resetForm();
        this.util.successToast('Calendar Detail Successfully Added','cloud-upload-sharp','warning')
      }).catch((er: any)=>{
        this.spinner = false;
        this.util.erroToast(er.message, 'snow-outline');
      })

    }else{

      this.util.NetworkToast();
    }
  }

}
