import { PlatformLocation } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AlertController, IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { CalendarMode, QueryMode, Step } from 'ionic2-calendar';
import { title } from 'process';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage {

  obj: Boolean;
  net: Boolean;
  subs: Subscription;
  spinner:boolean = false;
  @ViewChild('cal')
  myCalendar: ElementRef | undefined;
  eventSource: any[]=[];
  event:any;
  isToday: boolean=false;
  isModalOpen: boolean=false;
  isEditModalOpen: boolean=false;
  editEvent: any;
  viewTitle: string='';
  jan: any[] = [];
  feb: any[] = [];
  mar: any[] = [];
  apr: any[] = [];
  may: any[] = [];
  jun: any[] = [];
  jul: any[] = [];
  aug: any[] = [];
  sep: any[] = [];
  oct: any[] = [];
  nov: any[] = [];
  dec: any[] = [];
  calendar = {
    mode: 'month' as CalendarMode,
    queryMode: 'local' as QueryMode,
    step: 30 as Step,
    currentDate: new Date(),
    dateFormatter: {
      formatMonthViewDay: function (date: Date) {
        return date.getDate().toString();
      },
      formatMonthViewDayHeader: function (date: Date) {
        return 'MonMH';
      },
      formatMonthViewTitle: function (date: Date) {
        return 'testMT';
      },
      formatWeekViewDayHeader: function (date: Date) {
        return 'MonWH';
      },
      formatWeekViewTitle: function (date: Date) {
        return 'testWT';
      },
      formatWeekViewHourColumn: function (date: Date) {
        return 'testWH';
      },
      formatDayViewHourColumn: function (date: Date) {
        return 'testDH';
      },
      formatDayViewTitle: function (date: Date) {
        return 'testDT';
      },
    },
    formatDay: "'Day' dd",
    formatDayHeader: "'Day' EEE",
    formatDayTitle: "'Day' MMMM dd, yyyy",
    formatWeekTitle: "'Week' w",
    formatWeekViewDayHeader: "'Day' EEE d",
    formatHourColumn: "'hour' ha",
    showEventDetail: true,
    startingDayMonth: 2,
    startingDayWeek: 2,
    allDayLabel: 'testallday',
    noEventsLabel: 'None',
    timeInterval: 15,
    autoSelect: false,
    locale: 'zh-CN',
    dir: 'rtl',
    scrollToHour: 3,
    preserveScrollPosition: true,
    lockSwipeToPrev: true,
    lockSwipeToNext: true,
    lockSwipes: true,
    startHour: 9,
    endHour: 16,
    sliderOptions: {
      spaceBetween: 10,
    },
  };


  constructor(public platform: Platform ,public route: Router,public db: DatabaseService,
   private obsr: ObsrService, public routerOutlet: IonRouterOutlet,
    private utilService: UtillService, public alertctrl: AlertController, public location: PlatformLocation) {


      this.obsr.network.subscribe(re=>{
        this.net=re;
        console.log('Connecteffffffff');

      });

     this.obsr.user.subscribe(re=>{
      this.obj=re;
     })
   }
   ionViewWillEnter(){
    this.getCalendar();
   }

   ionViewDidEnter(){
    console.log('calendarview entering');

    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
      if(this.isEditModalOpen){
        this.isEditModalOpen = false;
      }else if(this.isModalOpen){
        this.isModalOpen = false
      }else{
          this.route.navigateByUrl('/dashboard');
        }

    })
    console.log(localStorage.getItem('calendarref'));



   }

   ionViewWillLeave(){
    console.log('calendar view leaving');

    this.subs.unsubscribe();
   }

   async getCalendar(){
    this.spinner = true;
    this.eventSource = [];
    let events: any[] = []
    this.jan=[];
    this.feb=[];
    this.mar=[];
    this.apr=[];
     this.may=[];
     this.jun = [];
     this.jul = [];
     this.aug = [];
    this.sep = [];
    this.oct= [];
    this.nov = [];
    this.dec = [];
    return this.db.getCalendar().subscribe((data)=>{
      console.log('calendar ',data);
      events = [];
      this.jan = [];
      this.feb = [];
      this.mar = [];
      this.apr = [];
      this.may = [];
      this.jun = [];
      this.jul = [];
      this.aug = [];
      this.sep = [];
      this.oct = [];
      this.nov = [];
      this.dec = [];
      for(var i = 0; i<data.length; i++){
        console.log(data);
        const d = new Date(data[i].date);
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const currDate = new Date();
        const currYear = currDate.getFullYear();


        console.log(data[i].date.split('-')[2]);

        events.push({
          title: data[i].content,
          startTime: new Date(Date.UTC(year,month,day)),
          endTime: new Date(Date.UTC(year,month,day+1)),
          allDay: true
        })

        if(month == 0){
          this.jan.push({
            docid: data[i].docid,
            year: data[i].date.split('-')[0],
            month: data[i].date.split('-')[1],
            day: data[i].date.split('-')[2],
            content: data[i].content,
            isl: data[i].isl
          })
        }else if(month ==1){
          this.feb.push({
            docid: data[i].docid,
            year: data[i].date.split('-')[0],
            month: data[i].date.split('-')[1],
            day: data[i].date.split('-')[2],
            content: data[i].content,
            isl: data[i].isl
          })
        }else if(month ==2){
          this.mar.push({
            docid: data[i].docid,
            year: data[i].date.split('-')[0],
            month: data[i].date.split('-')[1],
            day: data[i].date.split('-')[2],
            content: data[i].content,
            isl: data[i].isl
          })

        }else if(month ==3){
          this.apr.push({
            docid: data[i].docid,
            year: data[i].date.split('-')[0],
            month: data[i].date.split('-')[1],
            day: data[i].date.split('-')[2],
            content: data[i].content,
            isl: data[i].isl
          })
        }else if(month ==4){
          this.may.push({
            docid: data[i].docid,
            year: data[i].date.split('-')[0],
            month: data[i].date.split('-')[1],
            day: data[i].date.split('-')[2],
            content: data[i].content,
            isl: data[i].isl
          })

        }else if(month ==5){
          this.jun.push({
            docid: data[i].docid,
            year: data[i].date.split('-')[0],
            month: data[i].date.split('-')[1],
            day: data[i].date.split('-')[2],
            content: data[i].content,
            isl: data[i].isl
          })

        }else if(month ==6){
          this.jul.push({
            docid: data[i].docid,
            year: data[i].date.split('-')[0],
            month: data[i].date.split('-')[1],
            day: data[i].date.split('-')[2],
            content: data[i].content,
            isl: data[i].isl
          })

        }else if(month ==7){
          this.aug.push({
            docid: data[i].docid,
            year: data[i].date.split('-')[0],
            month: data[i].date.split('-')[1],
            day: data[i].date.split('-')[2],
            content: data[i].content,
            isl: data[i].isl
          })

        }else if(month ==8){
          this.sep.push({
            docid: data[i].docid,
            year: data[i].date.split('-')[0],
            month: data[i].date.split('-')[1],
            day: data[i].date.split('-')[2],
            content: data[i].content,
            isl: data[i].isl
          })

        }else if(month ==9){
          this.oct.push({
            docid: data[i].docid,
            year: data[i].date.split('-')[0],
            month: data[i].date.split('-')[1],
            day: data[i].date.split('-')[2],
            content: data[i].content,
            isl: data[i].isl
          })

        }else if(month ==10){
          this.nov.push({
            docid: data[i].docid,
            year: data[i].date.split('-')[0],
            month: data[i].date.split('-')[1],
            day: data[i].date.split('-')[2],
            content: data[i].content,
            isl: data[i].isl
          })

        }else if(month ==11){
          this.dec.push({
            docid: data[i].docid,
            year: data[i].date.split('-')[0],
            month: data[i].date.split('-')[1],
            day: data[i].date.split('-')[2],
            content: data[i].content,
            isl: data[i].isl
          })
        }

      }


      this.spinner = false;
      this.eventSource = events;

    })
   }
   ngOnInit(){

   }



setmodel(state: boolean){
  this.isModalOpen = state;
}
seteditmodel(state: boolean){
  this.isEditModalOpen = state;
}
updateClick(data: any){
  console.log(data);
  const d = data.year + "-" + (data.month) + "-" + data.day;
  console.log(d);

  this.editEvent = {
    docid: data.docid,
    date: d,
    content: data.content,
    isl: data.isl
  }

  // this.editEvent = data;
  this.seteditmodel(true);
}
update(){
  if(this.net){
    this.spinner = true;
    this.isEditModalOpen = false;
    this.db.updateCalendarFireBase(this.editEvent).then(() => {
      this.spinner = false;
      this.utilService.successToast('Calendar event successfully','thumbs-up-outline','success');
    }).catch(er=>{
      this.spinner = false;
      this.utilService.erroToast('Something Went Wrong', 'bug-outline');
    });

  }else{
    this.utilService.NetworkToast();
  }
}

async deleteClick(data: any){
  console.log(data);
  if(this.net){
    const alert = await this.alertctrl.create({
      header: 'Are You Sure To Delete',
      cssClass: 'delAlert',
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass : 'delAlert',
          handler: () =>{
            console.log('cancelled');

          }
        },{
          text: 'Delete',
          role: 'confirm',
          handler: () =>{
            this.spinner = true;
            console.log('delete Confirmed');
             this.db.deletecalendarFireBase(data).then(()=>{
                this.spinner = false;
                  this.utilService.successToast('Calendar event deleted successfully','trash-outline','warning');
              }).catch((er)=>{
                this.utilService.erroToast('Something Went Wrong', 'bug-outline');
              });

          }
        }
      ]
    });
    await alert.present();
  }else{
    this.utilService.NetworkToast();
  }
}
onEventSelected(event: any) {
  console.log(
    'sas'
  );

  console.log(
    'Event selected:' +
      event.startTime +
      '-' +
      event.endTime +
      ',' +
      event.title
  );
}
onViewTitleChanged(title: string) {
  this.viewTitle = title;
  console.log(
    'view title changed: ' + title + ', this.viewTitle: ' + this.viewTitle
  );
}
onCurrentDateChanged(ev: Date) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  ev.setHours(0, 0, 0, 0);
  this.isToday = today.getTime() === ev.getTime();
  console.log('Currently viewed date: ' + ev);
}




}
