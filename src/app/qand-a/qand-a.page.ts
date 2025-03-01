import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {  NavigationExtras, Router } from '@angular/router';
import { Platform,  AlertController, IonModal } from '@ionic/angular';
import {  Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';

import SwiperCore, { EffectCoverflow, Pagination } from 'swiper';

SwiperCore.use([EffectCoverflow, Pagination]);
@Component({
  selector: 'app-qand-a',
  templateUrl: './qand-a.page.html',
  styleUrls: ['./qand-a.page.scss'],
})
export class QandAPage  {

  @ViewChild('modal1') modal: IonModal;
  @ViewChild('modal2') modal2: IonModal;


  isQuizView: boolean = false;
  isQuestionView: boolean = false;
  isUserDetailView: boolean = false;
  isAnswerSheet: boolean = false;
  isCorrectioView: boolean = false;
  isRevealView: boolean = false;
  anyContent: boolean = false;
  anyUserContent: boolean = false;
  isEditOpen: boolean = false;

  obj: Boolean;
  net: Boolean;
  subs: Subscription;
  spinner: boolean = false;
  //cardSpinner: boolean = false;

  AdminData: any;
  UserData: any;


  currQuiz: any; //for admin slide
  Responses: any;
  Answers: any;
  RevealedAnswers: any;

  clickedQuiz: any; // For Genrel User slide
  user: any = {name:'',mobile:'',country:'',city:'',email:''};
  progress:boolean = false;
  btnValid: boolean = false;

  correctCount: number;
  totalCount: number;

  adminView:boolean = false

  // viewSet: boolean = false;


  constructor(public platform: Platform ,public route: Router,public db: DatabaseService,
   private obsr: ObsrService, private utilService: UtillService, public alertctrl: AlertController) {
    this.obsr.network.subscribe(re=>{
      this.net=re;
      //console.log(re);
    });
    this.obsr.user.subscribe(re=>{
      this.obj = re
    });
   }

  ionViewWillEnter(){
    // console.log('View will enter');
    if(this.obj){
      this.getAdminData();
    }
    this.getUserData();

    this.adminView = false

  }
  ionViewDidEnter(){
    //console.log('ziyaram view entering');

    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{

      if(!this.isQuestionView && !this.isUserDetailView && !this.isQuizView && !this.isAnswerSheet && !this.isCorrectioView && !this.isRevealView){
        this.route.navigateByUrl('/');
       }

      if(this.isQuestionView){
        this.isQuestionView = false;

        setTimeout(()=>{
          this.isQuizView = true;
        }, 500);
        // this.isQuizView = false
      }

      if(this.isQuizView){
        this.isQuizView = false;
          //this.currQuiz = null;
      }

      if(this.isUserDetailView){
        this.isUserDetailView = false;
      }

      if(this.isAnswerSheet){
        this.isAnswerSheet = false;
      }

      if(this.isCorrectioView){
        this.isCorrectioView = false;

        setTimeout(() =>{
          this.isQuizView = true;
        }, 500);
      }

      if(this.isRevealView){
        this.isRevealView = false;
      }



    })



  // const loading = setInterval(()=>{
  //   this.updateCss();
  //   if(this.viewSet){
  //     clearInterval(loading);
  //   }
  // },1000);

 }

//  updateCss(){

//   const tool = document.querySelector('.qnatool') as HTMLElement;
//  const list = document.querySelector('.lstqna') as HTMLElement;
//  const listcont = document.querySelector('.lstcontqna') as HTMLElement;
//  const cont = document.querySelector('.contqna') as HTMLElement;
//   const bar = document.querySelector('ion-tab-bar') as HTMLElement;
//   //const search = document.querySelector('.barziy') as HTMLElement;
//   //const swiper = document.querySelector('.swiper') as HTMLElement;

//   const main = document.querySelector('.mainqna') as HTMLElement;


//   if(tool && bar){


//     const dyHeight = tool.offsetHeight;
//     const barHeight = bar.offsetHeight;
//     //const searchHeight = search.offsetHeight;

//     if(dyHeight > 0 && barHeight > 0){

//       main.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px)`
//       cont.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px)`
//       list.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px)`
//       listcont.style.height = `calc(100vh - ${dyHeight}px - ${barHeight}px)`
//       //swiper.style.height = `85vh`
//       this.viewSet = true;



//     }else {
//       console.log('Not enough height');

//     }

//  }

//  }

   ionViewWillLeave(){
    //console.log('Ziyaram view leaving');

    this.subs.unsubscribe();
   }

   getAdminData(){
    this.spinner = true;
   // this.db.getAlertContent();
    this.db.GetforAdmin().subscribe((re: any)=>{
      // console.log('length : ',re.length);
      //
      if(re.length > 0){
        this.anyContent = true;
        this.AdminData = re;

      }else{
        this.anyContent = false;
      }
      this.spinner = false;
    })
   }

   getUserData(){
    this.spinner = true;
    // this.db.getAlertContent();
     this.db.GetforUsers().subscribe((re: any)=>{
       //console.log('length : ',re.length);
       //
       if(re.length > 0){
         this.anyUserContent = true;
         this.UserData = re;

       }else{
         this.anyUserContent = false;
       }
       this.spinner = false;
     })
   }

   navToAdd(){
    this.route.navigateByUrl('add-qn-a')
   }

   OpenQuiz(data: any){
    //console.log(data);
    this.currQuiz = {};
    this.Responses=[];
    this.progress = true;
    this.isQuizView = true;
    this.currQuiz = data;
    this.db.getResponseforQuiz(data).subscribe(re=>{
      // console.log(re);
      this.Responses = re;
      this.progress=false;

    })

   }

   closeQuizView(){
    this.isQuizView = false;
    this.currQuiz = {number:'',startDate: '',endDate: '',status:'', questions:[]=[]};
   }

   OpenQuestions(){
    this.isQuizView = false;

    setTimeout(()=>{
      this.isQuestionView = true;
    }, 500);

   }

   closeQuestions(){
    this.isQuestionView = false;

    setTimeout(()=>{
      this.isQuizView = true;
    }, 500);

   }

   getCorrectAns(obj: any){
    return obj[obj.crctAns];
  }

   OpenQuestionsSheet(){

    this.isQuizView = false;

    setTimeout(() =>{
      this.NavtoEdit();
    }, 500)
   }

   NavtoEdit(){
    const param:NavigationExtras = {
      queryParams: {
        source: JSON.stringify(this.currQuiz)
      }
    }
    //this.currQuiz = null;

    this.route.navigate(['add-qn-a'], param);
   }

   async DeleteQuiz(){
    if(this.net){
      const alert = await this.alertctrl.create({
        header: 'Are You Sure To Delete',
        cssClass: 'delAlert',
        buttons:[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () =>{
              //console.log('cancelled');

            }
          },{
            text: 'Delete',
            role: 'confirm',
            handler: () =>{
              this.spinner = true;
              //console.log('delete Conformed');
               this.db.deleteQnA(this.currQuiz).then(()=>{
                this.spinner = false;
                this.isQuizView = false;
                    this.utilService.successToast('Quiz deleted successfully','trash-outline','warning');
                }).catch((er)=>{
                  this.spinner = false;
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

   ///////////Users Slide//////////////////
   temp :any;
   UserClicked(data: any){
    // console.log(data);

    if(data.status === 'Active'){
      this.isUserDetailView = true;
      //this.clickedQuiz = {...data};
      this.clickedQuiz = structuredClone(data);

    }

  }

  closeUserInfoView(){
    this.isUserDetailView = false;
  }


  SaveUserInfo(){
    this.progress = true;
    const reg = new RegExp( /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    if(!reg.test(this.user.email)){
      this.user.email = '';
    }

    if(this.net){
      this.db.AlreadySentOrNot(this.user.mobile, this.clickedQuiz).subscribe(d=>{
        this.progress = false;
        this.isUserDetailView = false;
        if(d.size < 1){
          setTimeout(() =>{
            this.isAnswerSheet = true;
          }, 500);

        }else{
          this.utilService.erroToast('User already sent the quiz', 'alert-circle-outline');
        }

      })
    }else{
      this.utilService.NetworkToast();
    }

    //this.isAnswerSheet = true;

  }

  closeAnswerSheet(){
    this.isAnswerSheet = false;
  }

  SaveAnswer(){
    //console.log(this.clickedQuiz);
    this.progress = true
    this.btnValid = true;

    const now = new Date();

    // Extract year, month, and day from the current date
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth(); // Months are zero-based
    const day = now.getUTCDate();
    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();
    const second = now.getUTCSeconds();

    // Create a new Date object for midnight UTC of the current date
    const startOfDayUTC = new Date(Date.UTC(year, month, day, hour, minute, second));

    // Get the timestamp in milliseconds for the start of the day in UTC
    const timestampUTC = startOfDayUTC.getTime();


    const data = {quizid:this.clickedQuiz.docid, date: timestampUTC, user: this.user, answer: this.clickedQuiz.questions};
    // console.log(data);
    if(this.net){
      this.db.SubmitResponse(data).then((re) =>{
        this.clickedQuiz = null;
        this.isAnswerSheet = false;
        this.btnValid = false;
        this.progress = false;
        this.utilService.successToast('Thank You For Your Answer', 'checkmark-circle-outline','success');
      })
    }else {
      this.utilService.NetworkToast();
    }


  }

  checkAnswers(data: any){
    this.correctCount = 0;
    this.totalCount = 0;
    this.Answers = {};

    this.Answers = data;
    this.totalCount = this.Answers.answer.length;

    for(let i = 0; i < this.totalCount; i++){
      if(this.Answers.answer[i].selected === this.Answers.answer[i].crctAns){
        this.correctCount ++;
      }
    }
    //console.log(this.correctCount);





    this.isQuizView = false;

    setTimeout(() =>{
      this.isCorrectioView = true;
    }, 500)
  }

  closeCorrectionSheet(){
    this.isCorrectioView = false;

    setTimeout(() =>{
      this.isQuizView = true;
    }, 500)
  }

  GetDate(){
    return Date.parse(new Date().toDateString())
  }

  RevealAnswers(data: any){
    // console.log(data);

    this.RevealedAnswers = [];
    this.RevealedAnswers = data;
    this.isRevealView = true;

  }

  closeAnswerReveal(){
    this.isRevealView = false;
  }

  pageTrans(){
    this.adminView = !this.adminView;
  }


}
