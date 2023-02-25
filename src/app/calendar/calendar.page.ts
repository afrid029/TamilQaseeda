import { PlatformLocation } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AlertController, IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { CalendarMode, QueryMode, Step } from 'ionic2-calendar';
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
  viewTitle: string='';
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
    private utilService: UtillService, public alertctrl: AlertController, public location: PlatformLocation, public afs: AngularFirestore) {
    
    
      this.obsr.network.subscribe(re=>{
        this.net=re;
      });

     this.obsr.user.subscribe(re=>{
      this.obj=re;
     })
   }

   ionViewDidEnter(){
    console.log('calendarview entering');
    
    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{ 
    })

   
   }

   ionViewWillLeave(){
    console.log('calendar view leaving');
    
    this.subs.unsubscribe();
   }
   ngOnInit(){
    // this.afs.collection(`calendar`).valueChanges().forEach((re: any)=>{
    //   re.forEach((da: any)=>{
    //     this.eventSource.push({
    //       title: da.content,
    //       startTime: new Date(Date.UTC(2023,1,20)),
    //       endTime: new Date(Date.UTC(2023,1,21)),
    //       allDay: true
  
    //     });
        
    //   })
      
      
      
    // })
    let event1: any[] = [];
    this.afs.collection(`calendar`).valueChanges().forEach((re: any)=>{
      re.forEach((da: any)=>{
        const d = new Date(da.date);
        console.log(d);
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();

        console.log(year, month, day);
        
        
        event1.push({
          title: da.content,
          startTime: new Date(Date.UTC(year,month,day)),
          endTime: new Date(Date.UTC(year,month,day+1)),
          allDay: true
  
        });
        this.eventSource = [...this.eventSource, event1[0]];
      event1 = [];
        
      })
      
      
      
      
    });

    console.log(this.eventSource);
    
    // this.eventSource.push({
    //   title: 'test',
    //   startTime: new Date(Date.UTC(2023,1,20)),
    //   endTime: new Date(Date.UTC(2023,1,21)),
    //   allDay: true
    // })

    // this.eventSource.push({
    //   title: 'tes2t',
    //   startTime: new Date(Date.UTC(2023,1,20)),
    //   endTime: new Date(Date.UTC(2023,1,21)),
    //   allDay: true
    // })
   }
   unsbr(){
    // this.subs.unsubscribe();
  }
async handleRefresh(event: any) {
  if(this.net){
    setTimeout(() => {
      this.db.getFromFireBase();
      console.log('refreshed ');
      event.target.complete();
    }, 2000);
        
  }else{
    event.target.complete();
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

/**************************************************************/
loadDate(){
  let event1: any[] = [];
  this.afs.collection(`calendar`).valueChanges().forEach((re: any)=>{
    re.forEach((da: any)=>{
      event1.push({
        title: da.content,
        startTime: new Date(Date.UTC(2023,1,20)),
        endTime: new Date(Date.UTC(2023,1,21)),
        allDay: true

      });
      this.eventSource = [...this.eventSource, event1[0]];
    event1 = [];
      
    })
    
    
    
    
  });

  // var events = [];
  // events.push({
  //   title: 'fsdfsd',
  //   startTime: new Date(Date.UTC(2023,1,23)),
  //   endTime: new Date(Date.UTC(2023,1,24)),
  //   allDay: true

  // });
  // this.eventSource = [...this.eventSource, events[0]];
  //  events = [];
  // events.push({
  //   title: 'fsdasasfsd',
  //   startTime: new Date(Date.UTC(2023,1,27)),
  //   endTime: new Date(Date.UTC(2023,1,28)),
  //   allDay: true

  // });
    
    console.log(this.eventSource);
    

    

  
}


}
