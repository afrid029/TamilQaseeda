import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { finalize, Observable, Subscription, tap } from 'rxjs';

import { UtillService } from '../services/utill.service';
import { ObsrService } from '../services/obsr.service';
import { DatabaseService } from '../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';


export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}
@Component({
  selector: 'app-add-ziyaram',
  templateUrl: './add-ziyaram.page.html',
  styleUrls: ['./add-ziyaram.page.scss','./../add/add.scss'],
})


export class AddZiyaramPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;
  @ViewChild('modal2') modal2: IonModal;
  @ViewChild('fileInput') inp: ElementRef;

  ziyaram: any = {name:'',description:'',location: '',day:'',long:'',lat:'',imageUrl:''}

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

  isFileUploaded: boolean = false;

  btnvalid: boolean = false;

  file: any;
  perc: number = 0;
  spinner: boolean = false;
  net: Boolean;

  isModalOpen: boolean = false;
  long: any;
  lat: any;
  selected: boolean = false;

  province: any;
  district: any;
  place: string;

  Central = ['Kandy','Matala','Nuwera Eliya'];
  Eastern = ['Ampara', 'Batticaloa', 'Trincomale'];
  North = ['Jaffna','Kilinochi','Mannar','Mullaitivu','Vavuniya'];
  Northcentral = ['Anuradhapura', 'Polannaruwa'];
  Northwestern = ['Kurunagela', 'Puttalam'];
  Sabragamuva = ['Kegalle','Ratnapura'];
  Southern = ['Galle','Hambantota','Matara'];
  Uva = ['Badulla','Moneragala'];
  Western = ['Colombo','Gampaha','Kalutara'];

  dist: any[];
  subs: Subscription;
  admin: boolean = false;
  update: boolean = false;


  currImg: string;
  closeButton: boolean = false;
  newImage: boolean = false;

  locationStat: string = "Locate Ziyaram Position"
  title: string = " Add Ziyaram Detail";
  fileSelected: boolean = true;
  constructor(private storage: AngularFireStorage, public utill: UtillService, public obsr: ObsrService, public datasc: DatabaseService, public router: Router, public platform: Platform,
    public active: ActivatedRoute, public location: Location) {

    this.platform.keyboardDidShow.subscribe((ev: any)=>{
      const { keyboardHeight  } = ev;
      //console.log(ev);


    })
    this.obsr.user.subscribe((re)=>{
      this.admin = re;
      if(!re){
        this.title = "Send Ziyaram Details"
      }else{
        this.title = "Add Ziyaram Details"
      }
    })
    this.obsr.network.subscribe((re)=>{
      this.net = re;
    })

    this.obsr.latitude.subscribe(re=>{
      this.lat = re;
    })

    this.obsr.longtitude.subscribe(re=>{
      this.long = re;
    })


    this.obsr.LocSelected.subscribe(re=>{
      this.selected = re;
      if(re){
        this.locationStat = 'Location Selected';
      }else{
        this.locationStat = 'Locate Ziyaram Position';
      }

      //console.log(this.locationStat);

    })

    this.active.queryParams.subscribe(params=>{
      if(params && params['source']){
        this.title = 'Update Ziyaram Details'
        this.ziyaram = JSON.parse(params['source']);
        this.currImg = this.ziyaram.imageUrl;
        this.update = true;
        const s = this.ziyaram.location;
        const ar = s.split(',');
        /////console.log(ar.slice(0,ar.length -2).toString());

        this.place = ar.slice(0,ar.length -2).toString();
        this.district = ar[ar.length - 2];
        this.province = ar[ar.length - 1];
        this.fileSelected = false;
        this.obsr.latitude.next(this.ziyaram.lat);
        //console.log(this.obsr.latitude.getValue());

        this.obsr.longtitude.next(this.ziyaram.long);
        this.obsr.LocSelected.next(true);
      }
    })
   }


   ionViewDidEnter(){
    //console.log('view entering');


    this.subs = this.platform.backButton.subscribeWithPriority(2,()=>{
      //console.log('Dashboard ',this.constructor.name);

      this.goBack();
      this.clearMap();
    })
   }

   goBack(){
    //console.log(this.update);

    if(this.update){
      this.router.navigateByUrl('/ziyarams')
    }else{
      this.router.navigateByUrl('/dashboard');
    }
   }
   clearMap(){
    this.obsr.LocSelected.next(false);
      this.obsr.MapClicked.next(false);
      this.obsr.latitude.next(-1);
      this.obsr.longtitude.next(-1);
   }



  ionViewWillLeave(){
    //console.log('view leaving');
    this.subs.unsubscribe();
  }
  ngOnInit() {
  }


  openActionSheet(event: any){
    this.file = event.target.files.item(0);
    //console.log(this.file);
    this.fileSelected = false;
    this.closeButton = true;
    this.newImage = true;

  }


  clearFile(){
    //console.log('Clear file');
    this.newImage = false;
    this.inp.nativeElement.value='';
    this.closeButton = !this.closeButton;
    if(this.currImg){
      this.fileSelected = false;
    }else{
      this.fileSelected = true;
    }

  }

  submit(form: NgForm){
    //console.log(this.ziyaram);

    if(this.net){
      this.spinner = true;
      this.btnvalid = true;
      this.isFileUploaded = false;
      this.imgName = this.file.name;

      const fileStoragePath = `Images/${new Date().getTime()}_${this.file.name}`;
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
          this.UploadedImageURL.subscribe({

            next: (resp) =>{
              //   //console.log(resp);

              this.ziyaram.imageUrl = resp;
              this.isFileUploaded = true;

              this.utill.successToast('Picture has been successfully uploaded.', 'cloud-done', 'success');
            },

            error: (error: any) =>{
              this.utill.erroToast(error.message, 'cellular-outline');
            }
            
        });
        }),
        tap((snap: any) => {
          this.imgSize = snap.totalBytes;
        })
      ).subscribe();

      const adding = setInterval(()=>{
        if(this.isFileUploaded){

            this.ziyaram.location = this.place.charAt(0).toUpperCase() + this.place.slice(1) + "," + this.district + ","+this.province;
            //console.log(this.ziyaram.location);
            this.ziyaram.long = this.obsr.longtitude.getValue();
            this.ziyaram.lat = this.obsr.latitude.getValue();

            this.datasc.addZiyaramDetail(this.ziyaram).then(async (re: any)=>{
              this.spinner = false;
              this.router.navigateByUrl('dashboard');
              this.obsr.LocSelected.next(false);
              this.obsr.MapClicked.next(false);
              this.obsr.latitude.next(-1);
              this.obsr.longtitude.next(-1);
              this.btnvalid = false;
              this.ziyaram = {};
              this.clearFile();
              this.perc = 0;
              this.province = "";
              this.district = "";
              this.place = "";
              form.resetForm();
              if(this.admin){
                this.utill.successToast('Ziyaram Detail Successfully Added','cloud-upload-sharp','warning')
              }else{
                this.utill.successToast('Thanks For Your Details','cloud-upload-sharp','warning').then(()=>{

                  setTimeout(()=>{
                    this.utill.successToast('Admin Will Add This Detail In The List Soon','person-circle-outline','dark')
                  },2500)

                })
              }

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

  updateDetail(form: NgForm){
    //console.log(this.file);
    if(this.net){
      this.spinner = true;
      this.btnvalid = true;
      this.isFileUploaded = false;

      if(this.newImage){
        this.storage.storage.refFromURL(this.currImg).delete().catch((er)=>{
          this.utill.erroToast('Error in photo replacing ','alert-circle-outline')
        }).then(()=>{
          this.currImg = '';
          this.imgName = this.file.name;
          const fileStoragePath = `Images/${new Date().getTime()}_${this.file.name}`;
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

                  this.ziyaram.imageUrl = resp;
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
        });

      }else{
        this.isFileUploaded = true;
      }

      const adding = setInterval(()=>{
        if(this.isFileUploaded){

            this.ziyaram.location = this.place.charAt(0).toUpperCase() + this.place.slice(1) + "," + this.district + ","+this.province;
            //console.log(this.ziyaram.lat, this.ziyaram.long);
            this.ziyaram.long = this.obsr.longtitude.getValue();
            this.ziyaram.lat = this.obsr.latitude.getValue();
            //console.log(this.ziyaram.lat, this.ziyaram.long);

            this.datasc.updateZiyaramFireBase(this.ziyaram).then(async (re: any)=>{
              this.spinner = false;
              // this.location.normalize("/dashboard");
              this.router.navigateByUrl("/ziyarams");
              this.obsr.LocSelected.next(false);
              this.obsr.MapClicked.next(false);
              this.obsr.latitude.next(-1);
              this.obsr.longtitude.next(-1);
              this.btnvalid = false;
              this.ziyaram = {name:'',description:'',location:'',day:'',long:'',lat:'',imageUrl:''};
              this.clearFile();
              this.perc = 0;
              this.province = "";
              this.district = "";
              this.place = "";
              form.resetForm();
              this.utill.successToast('Ziyaram Details Updated Successfully','thumbs-up-outline','success')
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
  setOpen(value: boolean){
    this.chekService();


  }

  async chekService(){
    const t = await Geolocation.checkPermissions().then((re)=>{
      this.router.navigateByUrl('google-map');

    }).catch(async er=>{
      this.utill.erroToast('Turn On Your Location Service','power');


    });
  }

  setArray(){
    if(this.province === 'Central Province'){
      this.dist = this.Central;
    }
    if(this.province === 'Eastern Province'){
      this.dist = this.Eastern;
    }
    if(this.province === 'North Province'){
      this.dist = this.North;
    }
    if(this.province === 'Northcentral Province'){
      this.dist = this.Northcentral;
    }
    if(this.province === 'Northwestern Province'){
      this.dist = this.Northwestern;
    }
    if(this.province === 'Southern Province'){
      this.dist = this.Southern;
    }
    if(this.province === 'Sabragamuva Province'){
      this.dist = this.Sabragamuva;
    }
    if(this.province === 'Uva Province'){
      this.dist = this.Uva;
    }
    if(this.province === 'Western Province'){
      this.dist = this.Western;
    }
  }

  setProvince(province:string){
    this.province = province;
    this.modal.dismiss();
  }

  setDistrict(dist:string){
    this.district = dist;
    this.modal2.dismiss();
  }
}
