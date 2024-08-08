import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { delay, finalize, Observable, Subscription, tap } from 'rxjs';
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
  isFileUploaded: boolean = false;
  file: any;
  perc: number = 0;
  spinner: boolean = false;
  net: Boolean;
  fileSelected: boolean = false;
  closeButton: boolean = false;
  currImg: string;

  btnValid: boolean = false;
  imgName: string;
  fileUploadTask: AngularFireUploadTask;
  // Upload progress
  percentageVal: Observable<any>;
  UploadedImageURL: Observable<string>;
  imgSize: number;

  quiz: any = {number:'',startDate: '',endDate: '',imageUrl: '',status:'', questions:[]=[]};
  query: any = {id:'',qst: '', ans1:'', ans2:'', ans3:'', ans4:''};



  constructor(private platform: Platform,
              private route: Router,
              private storage: AngularFireStorage,
              private utill: UtillService,
              private datasc: DatabaseService,
              private obsr: ObsrService

  ) {
    this.obsr.network.subscribe((re)=>{
      this.net = re;
    });


  }

  ngOnInit() {
  }


  ionViewDidEnter(){
    //console.log('ziyaram view entering');
    console.log(this.quiz);


    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
        if(!this.isModalOpen){
          this.route.navigateByUrl('/dashboard');
        }else{
          this.isModalOpen = false
        }

    })
   }

   ionViewWillLeave(){
    //console.log('Ziyaram view leaving');

    this.subs.unsubscribe();
   }



   openActionSheet(event: any){
    this.file = event.target.files.item(0);
    //console.log(this.file);
    this.fileSelected = true;
    this.closeButton = true;
  }

  clearFile(){
    //console.log('Clear file');
    this.inp.nativeElement.value='';
    this.closeButton = !this.closeButton;
    this.fileSelected = false;

  }

  setViewModel(stat: boolean){
    this.isModalOpen = stat;
    if(!stat){
      this.isEditModel = false;
    }
    this.query={id:'',qst: '', ans1:'', ans2:'', ans3:'', ans4:''};

  }

  addList(){
    this.query.id = Date.now();
    this.quiz.questions.push(this.query);
    this.isModalOpen = false;
    this.query = {id:'',qst: '', ans1:'', ans2:'', ans3:'', ans4:''};
    console.log(this.quiz.questions.length < 1);

  }

  deleteList(id: any){
    this.quiz.questions = this.quiz.questions.filter((q:any) => q.id !== id);
    console.log(this.quiz);

  }

  editList(id: any){
    this.query = this.quiz.questions.filter((q:any) => q.id === id)[0];
    // console.log(this.query);
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

    this.isEditModel = false;
    this.isModalOpen = false;
    this.query = {id:'',qst: '', ans1:'', ans2:'', ans3:'', ans4:''};

  }

  PostQuiz(form: NgForm){
    if(this.net){
      this.quiz.endDate = Date.parse(new Date(this.quiz.endDate).toDateString());
      this.quiz.startDate = Date.parse(new Date(this.quiz.startDate).toDateString());
      const today = Date.parse(new Date().toDateString());

      this.quiz.status = "Active"

      this.spinner = true;
      this.btnValid = true;
      this.isFileUploaded = false;


      if(this.fileSelected){
        this.imgName = this.file.name;
        const fileStoragePath = `Images1/${new Date().getTime()}_${this.file.name}`;
        const imageRef = this.storage.ref(fileStoragePath);
        this.fileUploadTask = this.storage.upload(fileStoragePath, this.file);
        this.percentageVal = this.fileUploadTask.percentageChanges();
        this.percentageVal.subscribe((per)=>{
          //console.log(per);
          this.perc = per/100;

        })
        //console.log(this.fileUploadTask);
        this.fileUploadTask.snapshotChanges().pipe(
          finalize(() => {
            // Retreive uploaded image storage path
            this.UploadedImageURL = imageRef.getDownloadURL();
            this.UploadedImageURL.subscribe(
              (resp) => {
                //console.log(resp);

                this.quiz.imageUrl = resp;
                this.isFileUploaded = true;

                this.utill.successToast('Picture has been successfully uploaded.', 'cloud-done', 'success');


              },
              (error) => {
                this.utill.erroToast(error.message, 'cellular-outline');
              }
            );
          }),
          tap((snap: any) => {
            this.imgSize = snap.totalBytes;
          })
        ).subscribe();

      }else{
        this.isFileUploaded = true;
        this.quiz.imageUrl = '';
      }

      const adding = setInterval(()=>{
        if(this.isFileUploaded){



            this.datasc.AddQnA(this.quiz).then(async (re: any)=>{
              this.spinner = false;
              this.route.navigateByUrl('qand-a');
              this.btnValid = false;
              this.quiz = {number:'',startDate: '',endDate: '',imageUrl: '',status:'', questions:[]=[]};;
              this.clearFile();
              this.perc = 0;
              form.resetForm();

                this.utill.successToast('Quiz Successfully Added','cloud-upload-sharp','warning')


            }).catch((e: any)=>{
              this.spinner = false;
              //console.log('Error encountered ', e.message);
              this.utill.erroToast(e.message, 'snow-outline');
            });

            clearInterval(adding);
        }
      },1000)



    }else{
      this.utill.NetworkToast();
    }

  }

}
