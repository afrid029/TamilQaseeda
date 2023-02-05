import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { finalize, Observable, tap } from 'rxjs';

import { UtillService } from '../services/utill.service';
import { ObsrService } from '../services/obsr.service';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';

export interface imgFile {
  name: string;
  filepath: string;
  size: number;
} 
@Component({
  selector: 'app-add-ziyaram',
  templateUrl: './add-ziyaram.page.html',
  styleUrls: ['./add-ziyaram.page.scss'],
})


export class AddZiyaramPage implements OnInit {

  ziyaram: any = {name:'',description:'',location: '',day:'',long:'',lat:'',imageUrl:'',updatedDate:0, deleted: false}

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
  isFileUploading: boolean = false;
  isFileUploaded: boolean = false;

  btnvalid: boolean = false;

  perc: number = 0;
  spinner: boolean = false;
  net: Boolean;
  constructor(private storage: AngularFireStorage, public utill: UtillService, public obsr: ObsrService, public datasc: DatabaseService, public router: Router) {
    this.obsr.network.subscribe((re)=>{
      this.net = re;
    })
   }

  ngOnInit() {
  }

  async openActionSheet(event: any){
    const file = event.target.files.item(0);

    if(this.net){
      this.btnvalid = true;
    this.isFileUploading = true;
    this.isFileUploaded = false;
    this.imgName = file.name;

    const fileStoragePath = `Images/${new Date().getTime()}_${file.name}`;
    const imageRef = this.storage.ref(fileStoragePath);
    this.fileUploadTask = this.storage.upload(fileStoragePath, file);
    this.percentageVal = this.fileUploadTask.percentageChanges();
    this.percentageVal.subscribe((per)=>{
      console.log(per);
      this.perc = per/100;

    })    
    console.log(this.fileUploadTask);
    this.fileUploadTask.snapshotChanges().pipe(
      finalize(() => {
        // Retreive uploaded image storage path
        this.UploadedImageURL = imageRef.getDownloadURL();
        this.UploadedImageURL.subscribe(
          (resp) => {
            console.log(resp);
            
            this.ziyaram.imageUrl = resp;
            this.isFileUploading = false;
            this.isFileUploaded = true;

            this.utill.successToast('Picture has been successfully uploaded.', 'cloud-done', 'success');
            this.btnvalid = false;
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
      this.utill.NetworkToast();
    }
  }
  
  submit(){
    console.log(this.ziyaram);

    if(this.net){
      this.spinner = true;
      this.ziyaram.updatedDate = new Date().getTime();

      this.datasc.addZiyaramDetail(this.ziyaram).then(async (re: any)=>{
        this.spinner = false;
        this.router.navigateByUrl('dashboard');
        this.ziyaram = {name:'',description:'',location:'',day:'',long:'',lat:'',imageUrl:'',updatedDate:0, deleted: false};
        this.utill.successToast('Ziyaram Detail Successfully Added','cloud-upload-sharp','warning')
      }).catch((e: any)=>{
        this.spinner = false;
        console.log('Error encountered ', e.message);   
        this.utill.erroToast(e.message, 'snow-outline'); 
      });
      
      
    }else{
      this.utill.NetworkToast();
    }
    
  }


}
