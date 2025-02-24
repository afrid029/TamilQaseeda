import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UtillService } from '../services/utill.service';
import { DatabaseService } from '../services/database.service';
import { NgForm } from '@angular/forms';
import { ObsrService } from '../services/obsr.service';


@Component({
  selector: 'app-add-qn-a',
  templateUrl: './add-qn-a.page.html',
  styleUrls: ['./add-qn-a.page.scss'],
})
export class AddQnAPage implements OnInit {


  @ViewChild('fileInput') inp: ElementRef;

  isModalOpen: boolean = false;
  isEditModel: boolean = false
  subs: Subscription;
  spinner: boolean = false;
  net: Boolean;
  isUpdateQuiz: boolean = false;

  quiz: any = {number:'',startDate: '',endDate: '',status:'', questions:[]=[]};
  query: any = {id:'',qst: '', ans1:'', ans2:'', ans3:'', ans4:'', crctAns:''};
  minDate: string;


  constructor(private platform: Platform,
              private route: Router,
              private storage: AngularFireStorage,
              private utill: UtillService,
              private datasc: DatabaseService,
              private obsr: ObsrService,
              private active: ActivatedRoute

  ) {
    this.obsr.network.subscribe((re)=>{
      this.net = re;
    });

    this.minDate = new Date().toISOString().split('T')[0];


  }

  ngOnInit() {
  }


  ionViewWillEnter(){
    //console.log('ziyaram view entering');

    this.active.queryParams.subscribe(params=>{
      if(params && params['source']){
        this.quiz = JSON.parse(params['source']);

        let dt = new Date(this.quiz.startDate);
        let year = dt.toLocaleDateString("dafault",{year: "numeric"});
        let month = dt.toLocaleDateString("dafault",{month: "2-digit"});
        let day = dt.toLocaleDateString("dafault",{day: "2-digit"});

        let d = year + '-' + month+ '-' + day;
        this.quiz.startDate = d;

        dt = new Date(this.quiz.endDate);
        year = dt.toLocaleDateString("dafault",{year: "numeric"});
        month = dt.toLocaleDateString("dafault",{month: "2-digit"});
        day = dt.toLocaleDateString("dafault",{day: "2-digit"});
        d = year + '-' + month+ '-' + day;
        this.quiz.endDate = d;


        this.isUpdateQuiz = true;

        // console.log(this.quiz);

      }else{
        this.isUpdateQuiz = false;
      }
    })


    // console.log(this.quiz);


    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
        if(!this.isModalOpen){
          this.route.navigateByUrl('/qand-a');
        }else{
          this.isModalOpen = false
        }

    })
   }

   ionViewWillLeave(){
    // console.log('Ziyaram view leaving');
    this.quiz = {number:'',startDate: '',endDate: '',status:'', questions:[]=[]};
    this.subs.unsubscribe();
   }

  setViewModel(stat: boolean){
    this.isModalOpen = stat;
    if(!stat){
      this.isEditModel = false;
    }
    this.query={id:'',qst: '', ans1:'', ans2:'', ans3:'', ans4:'',crctAns:''};

  }

  addList(){
    this.query.id = Date.now();
    this.query.crctAns = 'ans'+this.query.crctAns;
    this.quiz.questions.push(this.query);
    this.isModalOpen = false;
    this.query = {id:'',qst: '', ans1:'', ans2:'', ans3:'', ans4:'', crctAns:''};
    //console.log(this.quiz.questions.length < 1);
    // console.log(this.quiz);

  }

  getCorrectAns(obj: any){
    return obj[obj.crctAns];
  }

  deleteList(id: any){
    this.quiz.questions = this.quiz.questions.filter((q:any) => q.id !== id);
    // console.log(this.quiz);

  }

  editList(id: any){
    this.query = this.quiz.questions.filter((q:any) => q.id === id)[0];
    //console.log(this.query);
    this.query.crctAns = this.query.crctAns[this.query.crctAns.length - 1];
    //console.log(this.query);
    // console.log(this.quiz.questions);

    this.isEditModel = true;
    this.isModalOpen = true;
  }

  updateList(){

    let index = this.quiz.questions.findIndex((q: any)=>q.id === this.query.id);

    this.quiz.questions[index].qst = this.query.qst;
    this.quiz.questions[index].ans1 = this.query.ans1;
    this.quiz.questions[index].ans2 = this.query.ans2;
    this.quiz.questions[index].ans3 = this.query.ans3;
    this.quiz.questions[index].ans4 = this.query.ans4;
    this.quiz.questions[index].crctAns = 'ans'+this.query.crctAns;

    this.isEditModel = false;
    this.isModalOpen = false;
    this.query = {id:'',qst: '', ans1:'', ans2:'', ans3:'', ans4:'',crctAns:''};




  }

  PostQuiz(form: NgForm){
    if(this.net){
      let st = this.quiz.endDate.split('-');
          //console.log(parseInt(st[0]));
      let specificDateUTC = new Date(Date.UTC(parseInt(st[0]), parseInt(st[1])-1, parseInt(st[2])));
          // Get the timestamp in milliseconds for this date
      let timestampUTC = specificDateUTC.getTime();
      this.quiz.endDate = timestampUTC;

       st = this.quiz.startDate.split('-');
          //console.log(parseInt(st[0]));
       specificDateUTC = new Date(Date.UTC(parseInt(st[0]), parseInt(st[1])-1, parseInt(st[2])));
          // Get the timestamp in milliseconds for this date
       timestampUTC = specificDateUTC.getTime();
      this.quiz.startDate = timestampUTC;

      this.quiz.status = "Active"


      this.spinner = true;



            this.datasc.AddQnA(this.quiz).then(async (re: any)=>{
              this.spinner = false;
              this.route.navigateByUrl('qand-a');
              this.quiz = {number:'',startDate: '',endDate: '',status:'', questions:[]=[]};;


              form.resetForm();

                this.utill.successToast('Quiz Successfully Added','cloud-upload-sharp','warning')


            }).catch((e: any)=>{
              this.spinner = false;
              console.log('Error encountered ', e.message);
              this.utill.erroToast(e.message, 'snow-outline');
            });

      }else{
        this.utill.NetworkToast();
      }
  }
  UpdateQuiz(form: NgForm){
    if(this.net){

      let st = this.quiz.endDate.split('-');
          //console.log(parseInt(st[0]));
      let specificDateUTC = new Date(Date.UTC(parseInt(st[0]), parseInt(st[1])-1, parseInt(st[2])));
          // Get the timestamp in milliseconds for this date
      let timestampUTC = specificDateUTC.getTime();
      this.quiz.endDate = timestampUTC;

       st = this.quiz.startDate.split('-');
          //console.log(parseInt(st[0]));
       specificDateUTC = new Date(Date.UTC(parseInt(st[0]), parseInt(st[1])-1, parseInt(st[2])));
          // Get the timestamp in milliseconds for this date
       timestampUTC = specificDateUTC.getTime();
      this.quiz.startDate = timestampUTC;

      this.spinner = true;

      this.datasc.UpdateQnA(this.quiz).then(()=>{
              this.spinner = false;
              this.route.navigateByUrl('qand-a');
              this.quiz = {number:'',startDate: '',endDate: '',status:'', questions:[]=[]};
              //form.resetForm();
              this.utill.successToast('Updated successfully','thumbs-up-outline','success');


            }).catch((e: any)=>{
              this.spinner = false;
              console.log('Error encountered ', e.message);
              this.utill.erroToast(e.message, 'snow-outline');
            });

      }else{
        this.utill.NetworkToast();
      }

  }

  getMinDate(){
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getUTCDate()).padStart(2, '0');

    const localDate = `${year}-${month}-${day}`;

   return localDate;
  }

}
