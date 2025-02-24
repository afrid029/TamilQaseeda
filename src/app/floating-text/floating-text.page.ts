import { Component, NgModuleFactory, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';

SwiperCore.use([EffectCoverflow, Pagination]);

@Component({
  selector: 'app-floating-text',
  templateUrl: './floating-text.page.html',
  styleUrls: ['./floating-text.page.scss'],
})
export class FloatingTextPage implements OnInit {
  net: boolean = false;
  obj: boolean = false;
  spinner: boolean = false;
  anyContent: boolean = false;
  content: any = {};
  datas: any = [];

  isModalOpen: boolean = false;
  isEditOpen: boolean = false;
  viewContent: any = {};
  editContent: any = {};

  subs: Subscription;

  constructor(private obsr: ObsrService, private platform: Platform, private router: Router, private db: DatabaseService, private utils: UtillService, private alertctrl: AlertController) {
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

    this.db.getBannerContent().subscribe((re: any)=>{
      //console.log('length : ',re.length);
      if(re.length > 0){
        this.anyContent = true;
        this.datas = re;
        // this.datas.date = new Date(this.datas.date)
        //console.log(this.datas);
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

  onSubmit(form: NgForm){
    //console.log(this.alert);
    if(this.net){
      this.spinner = true;
      //console.log(typeof(this.alert.date));

      const st = this.content.date.split('-');
          //console.log(parseInt(st[0]));

          const specificDateUTC = new Date(Date.UTC(parseInt(st[0]), parseInt(st[1])-1, parseInt(st[2])));

          // Get the timestamp in milliseconds for this date
          const timestampUTC = specificDateUTC.getTime();

      //const dt = Date.parse(new Date(this.content.date).toDateString());
      //console.log(dt);
      this.content.date = timestampUTC;


      this.db.sendBannerContent(this.content).then((re: any)=>{
        this.spinner = false;
        this.content = {};
        form.resetForm();
        this.utils.successToast('Successfully Added','cloud-upload-sharp','warning')

      }).catch((err: any)=>{
        this.spinner = false;
        this.utils.erroToast(err.message, 'snow-outline');
      })

    }else{
      this.utils.NetworkToast();
    }

  }

  setViewModel(state: boolean){
    this.isModalOpen = state;
  }

  setEditModel(state: boolean){
    this.isEditOpen = state;
  }

  promo(data: any){
    this.setViewModel(true);
    this.viewContent = data;

  }

  loadUpdate(data: any){
    this.editContent.docid = data.docid;
    this.editContent.content = data.content;

    const dt = new Date(data.date);
    const year = dt.toLocaleDateString("dafault",{year: "numeric"});
    const month = dt.toLocaleDateString("dafault",{month: "2-digit"});
    const day = dt.toLocaleDateString("dafault",{day: "2-digit"});

    const d = year + '-' + month+ '-' + day;
    this.editContent.date = d;

    this.setEditModel(true);

  }

  update(){

    const st = this.editContent.date.split('-');
          //console.log(parseInt(st[0]));

          const specificDateUTC = new Date(Date.UTC(parseInt(st[0]), parseInt(st[1])-1, parseInt(st[2])));

          // Get the timestamp in milliseconds for this date
          const timestampUTC = specificDateUTC.getTime();
    //console.log(this.editAlert.date);
    //const dt = Date.parse(new Date(this.editContent.date).toDateString());
    //console.log(dt);
    this.editContent.date = timestampUTC;
    if(this.net){
      this.spinner = true
      this.db.updateBannerContent(this.editContent).then(()=>{
        this.spinner = false;
        this.isEditOpen = false;
        this.utils.successToast('Updated successfully','thumbs-up-outline','success');
      }).catch(er =>{
        this.spinner = false;
        //console.log(er.message);

        this.utils.erroToast('Something Went Wrong', 'bug-outline');
      });
    }else{
      this.utils.NetworkToast();
    }


  }

  async deleteContent(data: any){
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
              // console.log('delete Confirmed');
               this.db.deleteBannerContent(data).then(()=>{
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

}
