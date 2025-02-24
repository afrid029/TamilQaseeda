import { Component, ElementRef, NgModuleFactory, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { finalize, Observable, Subscription, tap } from 'rxjs';
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { imgFile } from '../add-ziyaram/add-ziyaram.page';

SwiperCore.use([EffectCoverflow, Pagination]);

@Component({
  selector: 'app-wallalert',
  templateUrl: './wallalert.page.html',
  styleUrls: ['./wallalert.page.scss'],
})
export class WallalertPage implements OnInit {


  @ViewChild('fileInput') inp: ElementRef;

  net: boolean = false;
  obj: boolean = false;
  spinner: boolean = false;
  anyContent: boolean = false;
  alert: any = {date:'', imageUrl:[]};
  datas: any = [];

  isModalOpen: boolean = false;
  isEditOpen: boolean = false;
  viewAlert: any = {};
  editAlert: any = {};

  subs: Subscription;

  fileUploadTask: AngularFireUploadTask;
  // Upload progress
  percentageVal: Observable<any>;
  // Track file uploading with snapshot
  trackSnapshot: Observable<any>;
  // Uploaded File URL
  UploadedImageURL: Observable<string>;
  // Uploaded image collection
  files: Observable<imgFile[]>;
  // Image specifications
  imgName: string;
  imgSize: number;
  // File uploading status

  images: any[];
  fileSelected: boolean = true;
  closeButton: boolean;
  btnvalid: boolean;
  isFileUploaded: boolean;
  perc: number = 0;

  constructor(private obsr: ObsrService, private platform: Platform, private router: Router,
    private db: DatabaseService, private utils: UtillService, private alertctrl: AlertController,
  private storage: AngularFireStorage) {
    this.obsr.network.subscribe(re=>{
      this.net =re;
    });

    this.obsr.user.subscribe(re=>{
      this.obj =re;
    })
   }

  ngOnInit() {
  }
  ionViewWillEnter(){
    //console.log('View will enter');
    this.getData();


  }

  getData(){
    this.spinner = true;
   // this.db.getAlertContent();
    this.db.getAlertContent().subscribe((re: any)=>{
      //console.log('length : ',re.length);
      if(re.length > 0){
        this.anyContent = true;
        this.datas = re;

      }else{
        this.anyContent = false;
      }
      this.spinner = false;



    })
  }

  ionViewDidEnter() {
    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
      if(this.isEditOpen){
        this.isEditOpen = false;
      }else if(this.isModalOpen){
        this.isModalOpen = false
      }else{
          this.router.navigateByUrl('/dashboard');
        }

    })

  }

  ionViewWillLeave(){
    this.subs.unsubscribe();
  }
  private slide: any;
  setSwiperInstance(event: any){
    //console.log(event.activeIndex);
    this.slide = event
  }



  setViewModel(state: boolean){
    this.isModalOpen = state;
  }


  promo(data: any){
    this.setViewModel(true);
    this.viewAlert = data;

  }

  async deleteAlert(data: any){
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
              //console.log('delete Confirmed');
             // console.log(data);

               this.db.deleteAlertContent(data).then(()=>{
                  this.spinner = false;
                    this.utils.successToast('Deleted successfully','trash-outline','warning');
                }).catch((er)=>{
                  this.utils.erroToast('Something Went Wrong', 'bug-outline');
                });

            }
          }
        ]
      });
      await alert.present();
    }else{
      this.utils.NetworkToast();
    }
  }

  /*****************************************************************************************************/


  openActionSheet(event: any){
    this.images = event.target.files;
    // console.log(this.images);
    this.fileSelected = false;
    this.closeButton = true;

  }


  clearFile(){
    //console.log('Clear file');
    this.alert.imageUrl = [];
    this.inp.nativeElement.value='';
    this.closeButton = !this.closeButton;
    this.fileSelected = true;


  }

  onSubmit(form: NgForm){
    //console.log(this.ziyaram);

    if(this.net){
      // this.isFileUploaded = true;
      this.spinner = true;
      this.btnvalid = true;
      this.isFileUploaded = false;
      const length = this.images.length

      for(let j = 0; j < length; j++){
        // console.log(j);
        // console.log(this.images[j]);


        const fileStoragePath = `Images/Popups/${new Date().getTime()}_${this.images[j].name}`;
        const imageRef = this.storage.ref(fileStoragePath);
        this.fileUploadTask = this.storage.upload(fileStoragePath, this.images[j]);
        this.percentageVal = this.fileUploadTask.percentageChanges();
        this.percentageVal.subscribe((per)=>{
          //console.log(per);
          this.perc = per/100;

        });

        this.fileUploadTask.snapshotChanges().pipe(
            finalize(() => {
              // Retreive uploaded image storage path
              this.UploadedImageURL = imageRef.getDownloadURL();
              this.UploadedImageURL.subscribe({

                next:(resp) =>{
                  // console.log(resp);
                  this.alert.imageUrl.push(resp);
                  this.perc = 0;
                  if(j === length-1){
                    this.isFileUploaded = true;
                    this.utils.successToast('Picture(s) Uploaded Successfully.', 'cloud-done', 'success');

                   }
                },

                error: (error: any) => {
                  this.utils.erroToast(error.message, 'cellular-outline');
                }
              }
              );
            }),
            tap((snap: any) => {
              this.imgSize = snap.totalBytes;
            })
          ).subscribe();
      }


      const adding = setInterval(()=>{
        if(this.isFileUploaded){

          //console.log(this.alert.date);

          const st = this.alert.date.split('-');
          //console.log(parseInt(st[0]));

          const specificDateUTC = new Date(Date.UTC(parseInt(st[0]), parseInt(st[1])-1, parseInt(st[2])));

          // Get the timestamp in milliseconds for this date
          const timestampUTC = specificDateUTC.getTime();

          //console.log(timestampUTC);




          // const dt = Date.parse(new Date(this.alert.date).toDateString());
          // //console.log(dt);
          this.alert.date = timestampUTC;

            this.db.sendAlertContent(this.alert).then(async (re: any)=>{
              this.spinner = false;
              this.router.navigateByUrl('dashboard');
              this.btnvalid = false;
              this.alert = {name:'', imageUrl: []};
              this.clearFile();
              this.perc = 0;
              form.resetForm();
              this.utils.successToast('Popup image Successfully Added','cloud-upload-sharp','warning')


            }).catch((e: any)=>{
              this.spinner = false;
              //console.log('Error encountered ', e.message);
              this.utils.erroToast(e.message, 'snow-outline');
            });



            clearInterval(adding);
        }
      },1000)



    }else{
      this.utils.NetworkToast();
    }

  }

}
