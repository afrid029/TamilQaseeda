import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { AlertController, IonModal, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper';
import { DatabaseService } from '../services/database.service';
import { ObsrService } from '../services/obsr.service';
import { UtillService } from '../services/utill.service';

SwiperCore.use([EffectCoverflow, Pagination]);

@Component({
  selector: 'app-dua',
  templateUrl: './dua.page.html',
  styleUrls: ['./dua.page.scss'],
})
export class DuaPage implements OnInit {
  subs: Subscription;
  obj: Boolean;
  net: Boolean;
  spinner: boolean = false;
  arabic : any [] = ['الرَّحْمَنُ',
  'الرَّحِیْمُ',
  'الْمَلِكُ',
  'الْقُدُّوسُ',
  'السَّلاَمُ',
  'الْمُؤْمِنُ',
  'الْمُھَیْمِنُ',
  'الْعَزِیزُ',
  'الْجَبَّارُ',
  'الْمُتَكَبِّرُ',
  'الْخَالِقُ',
  'الْبَارِئُ',
  'الْمُصَوِّرُ',
  'الْغَفَّارُ',
  'الْقَھَّارُ',
  'الْوَھَّابُ',
  'الرَّزَّاقُ',
  'الْفَتَّاحُ',
  'الْعَلِيْمُ ',
  'الْقَابِضُ',
  'الْبَاسِطُ',
  'الْخَافِضُ',
  'الرَّافِعُ',
  'الْمُعِزُّ',
  'الْمُذِلُّ',
  'السَّمِیْعُ',
  'الْبَصِیْرُ',
  'الْحَكَمُ',
  'الْعَدْلُ',
  'اللَّطِیْفُ',
  'الْخَبِیْرُ',
  'الْحَلِیْمُ',
  'الْعَظِیْمُ',
  'الْغَفُورُ',
  'الشَّكُورُ',
  'الْعَلِيُّ',
  'الْكَبِیْرُ',
  'الْحَفِیْظُ',
  'الْمُقِيْتُ',
  'الْحَسِیْبُ',
  'الْجَلِیْلُ',
  'الْكَرِیْمُ',
  'الرَّقِیْبُ',
  'الْمُجِیْبُ',
  'الْوَاسِعُ',
  'الْحَكِیْمُ',
  'الْوَدُودُ',
  'الْمَجِیْدُ',
  'الْبَاعِثُ',
  'الشَّھِیْدُ',
  'الْحَقُّ',
  'الْوَكِیْلُ',
  'الْقَوِيُّ',
  'الْمَتِیْنُ',
  'الْوَلِيُّ',
  'الْحَمِیدُ',
  'الْمُحْصِي',
  'الْمُبْدِئُ',
  'الْمُعِیْدُ',
  'الْمُحْیِي',
  'الْمُِمیْتُ',
  'الْحَيُّ',
  'الْقَیُّومُ',
  'الْوَاجِدُ',
  'الْمَاجِدُ',
  'الْواحِدُ',
  'اَلاَحَدُ',
  'الصَّمَدُ',
  'الْقَادِرُ',
  'الْمُقْتَدِرُ',
  'الْمُقَدِّمُ',
  'الْمُؤَخِّرُ',
  'الأوَّلُ',
  'الآخِرُ',
  'الظَّاهِرُ',
  'الْبَاطِنُ',
  'الْوَالِي',
  'الْمُتَعَالِي',
  'الْبَرُّ ',
  'التَوَّابُ',
  'الْمُنْتَقِمُ',
  'العَفُوُّ',
  'الرَّؤُوفُ',
  'مَالِكُ الْمُلْكِ',
  'ذُو الْجَلٰلِ وَالْاِكْرَامِ',
  'الْمُقْسِطُ',
  'الْجَامِعُ',
  'الْغَنِيُّ',
  'الْمُغْنِي',
  'الْمَانِعُ',
  'الضَّارَّ',
  'النَّافِعُ',
  'النُّورُ',
  'الْھَادِي',
  'الْبَدِیْعُ',
  'الْبَاقِي',
  'الْوَارِثُ',
  'الرَّشِیْدُ',
  'الصَّبُورُ'

                    ];
  english : any [] = ['Ar-Rahman',
                      'Ar-Rahim',
                      ' Al-Malik',
                      'Al-Quddus',
                      'As-Salaam',
                      'Al-Mu\'min',
                      'Al-Muhaymin',
                      'Al-\'Aziz','Al-Jabbar','Al-Mutakabbir','Al-Khaaliq','Al-Baari','Al-Musawwir','Al-Ghaffaar','Al-Qahhaar','Al-Wahhaab','Ar-Razzaaq','Al-Fattah','Al-\'Alim','Al-Qaabid','Al-Baasit','Al-Khaafid','Ar-Raafi','Al-Mu\'izz','Al-Mudhill','As-Sami','Al-Basir',' Al-Hakam','Al-\'Adl','Al-Lateef','Al-Khabeer','Al-Halim','Al-\'Adzheem','Al-Ghafuur',
                      'Ash-Shakuur','Al-\'Ali','Al-Kabeer','Al-Hafidh','Al-Muqit','Al-Haseeb','Al-Jaleel','Al-Kareem','Ar-Raqeeb','Al-Mujeeb','Al-Waasi\'','Al-Hakim','Al-Waduud','Al-Majeed','Al-Ba\'ith','Ash-Shaheed','Al-Haqq','Al-Wakeel','Al-Qawi','Al-Matheen','Al-Wali','Al-Hameed','Al-Muhsi','Al-Mubdi','Al-Mu\'id','Al-Muhyi','Al-Mumeet','Al-Hayy','Al-Qayyuum',
                      'Al-Waajid','Al-Maajid','Al-Waahid','Al-Ahad','As-Samad','Al-Qaadir','Al-Muqtadir','Al-Muqaddim','Al-Muakhkhir','Al-Awwal','Al-Akhir','Adh-Dhahir','Al-Batin','Al-Waali','Al-Muta\'ali','Al-Barr','At-Tawwab','Al-Muntaqim','AL-\‘Afuww','Ar-Ra\'uf','Malik-ul-Mulk','Dhul Jalali wal Ikram','Al-Muqsit','Aj-Jami\'','Al-Ghani','Al-Mughni','Al-Mani\'','Ad-Darr','An-Nafi\'',
                      'An-Nur','Al-Hadi','Al-Badi\'','Al-Baqi','Al-Warith','Ar-Rashid','As-Sabuur'

                    ];
  tamil : any [] = ['அளவற்ற அருளாளன்',
                    'நிகரற்ற அன்புடையோன்',
                    'பேரரசன்',
                    'பரிசுத்தமானவன்',
                    'சாந்தி அளிப்பவன்',
                    'அபயமளிப்பவன்',
                    'பாதுகாப்பவன்',
                    'அனைத்தையும் மிகைத்தவன்',
                    'அடக்கி ஆள்பவன்',
                    'பெருமைக்குரியவன்',
                    'படைப்பாளன்',
                    'உருவாக்குபவன்',
                    'உருவம் அமைப்பவன்',
                    'மிகவும் மன்னிக்கக்கூடியவன்',
                    'அடக்கி ஆளுபவன்',
                    'வாரி வழங்குபவன்',
                    '	உணவளிப்பவன்',
                    'வெற்றியளிப்பவன்',
                    'யாவும் அறிந்தவன்',
                    'கைவசப்படுத்துபவன்',
                    'தாராளமாக கொடுப்பவன்',
                    'தாழ்த்த செய்பவன்',
                    'உயர்த்துபவன்',
                    'மேன்மை அடைய செய்பவன்',
                    'இழிவடையசெய்பவன்',
                    'யாவையும் செவியுறுபவன்',
                    'யாவற்றவையும் பார்ப்பவன்',
                    'தீர்ப்பளிப்பவன்',
                    'நீதமுடையவன்',
                    'நுட்பமானவன்',
                    'ஆழ்ந்தறிந்தவன்',
                    'அமைதியானவன்',
                    'மகத்துவமுள்ளவன்',
                    'மகா மன்னிப்பாளன்',
                    'நன்றி பாராட்டுபவன்',
                    'மிக உயர்ந்தவன்',
                    'மிகப் பெரியவன்',
                    'பாதுகாப்பவன்',
                    'கண்காணிப்பவன்',
                    'கணக்கெடுப்பவன்',
                    'மாண்புமிக்கவன்',
                    'பெரும் தயாளன்',
                    'கண்காணிப்பவன்',
                    'முறையீட்டை ஏற்பவன்',
                    'விசாலமானவன்',
                    'நுண்ணறிவுடயவன்',
                    'உள்ளன்பு மிக்கவன்',
                    'மகிமை உடையவன்',
                    'மறுமையில் எழுப்புபவன்',
                    'சாட்சியாளன்',
                    'உண்மையானவன்',
                    'பொறுப்பு ஏற்றுக்கொள்பவன்',
                    'வலிமை மிக்கவன்',
                    '	உறுதியானவன்',
                    'பாதுகாவலன்',
                    'புகழுக்குரியவன்',
                    'கணக்கிடுபவன்',
                    'துவங்குபவன்',
                    'இறுதியில் மீளவைப்பவன்',
                    'உயிரளிப்பவன்',
                    'மரணிக்கச் செய்பவன்',
                    'என்றென்றும் உயிருள்ளவன்',
                    'என்றென்றும் நிலைத்திருப்பவன்',
                    'கண்டு பிடிப்பவன்',
                    'பெரும் மதிப்பிற்குரியவன்',
                    'தனித்தவன்',
                    'அவன் ஒருவன்',
                    'தேவையற்றவன்',
                    'ஆற்றலுள்ளவன்',
                    'பேராற்றலுடையவன்',
                    'முற்படுத்துபவன்',
                    'பிற்படுத்துபவன்',
                    'ஆரம்பமானவன்',
                    'இறுதியானவன்',
                    'பகிரங்கமானவன்',
                    'அந்தரங்கமானவன்',
                    'அதிகார பொறுப்புள்ளவன்',
                    'மிக உயர்வானவன்',
                    'நன்மை புரிபவன்',
                    'மன்னிப்பை ஏற்றுக்கொள்பவன்',
                    'பழி வாங்குபவன்',
                    'மன்னிப்பளிப்பவன்',
                    'இரக்கமுடையவன்',
                    'அரசாட்சிக்கு உரியவன்',
                    'கம்பீரமும் கண்ணியமும் உடையவன்',
                    'நீதமாக நடப்பவன்',
                    'அனைத்தையும் ஒன்று சேர்ப்பவன்',
                    'தேவையற்றவன்',
                    'நிறைவாக்குபவன்',
                    'தடை செய்பவன்',
                    'துன்பமடைய செய்பவன்',
                    'பலன் அளிப்பவன்',
                    'பிரகாசமானவன்',
                    'நேர்வழி காட்டுபவன்',
                    'புதுமையாக படைப்பவன்',
                    'நிரந்தரமானவன்',
                    'உரிமையுடையவன்',
                    'நேர்வழி காட்டுபவன்',
                    'மிகப் பொறுமையாளன்'
                  ];

  searchKey: String;
  vis: String = "hidden";

  isModalOpen: boolean = false;
  isEditOpen: boolean = false;
  duaAnyContent: boolean = false;
  salAnyContent: boolean =false;
  currAwraath: any = {}
  editAwraath: any = {};

  dua: any = [];
  PermDua: any = [];

  salawat: any = [];
  PermSalawat: any = [];

  constructor(private platform: Platform, private obsr: ObsrService, private router: Router, private db: DatabaseService, private utilService: UtillService, private alertctrl: AlertController) {
    this.obsr.network.subscribe(re=>{
      this.net =re;
    });

    this.obsr.user.subscribe(re=>{
      this.obj =re;
    })
  }
  ionViewWillEnter(){
    //console.log('will Enter');
   this.getDua();
  }

  ionViewDidEnter(){
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

  ngOnInit() {
  }

  async getDua(){
    this.spinner = true;


    return this.db.getDuas().subscribe((data)=>{
      //console.log('Dua entering ', data);
      this.dua = [];
      this.salawat = [];

      //console.log('Dua entering ', this.dua.length, this.salawat.length);
      if(data.length > 0){

        for(var i=0; i< data.length; i++) {

          if(data[i].type === 'dua'){
            this.duaAnyContent = true;
            this.dua.push(data[i]);
          }else{
            this.salAnyContent = true;
            this.salawat.push(data[i]);
          }
        }

        this.PermDua = this.dua;
        this.PermSalawat = this.salawat;

        //console.log('Duas ', this.dua, this.salawat);

      }
      this.spinner = false;
      if(this.dua.length == 0){
        this.duaAnyContent = false
      }
      if(this.salawat.length == 0){
        this.salAnyContent = false
      }



    })

  }


  private slide: any;
setSwiperInstance(event: any){
  //console.log(event.activeIndex);
  this.slide = event
}

handleSearch(){
  if(this.searchKey.length > 0){
    this.vis = "visible";
    if(this.slide.activeIndex == 0){
      this.dua = [];
      this.PermDua.forEach((s: any)=>{
        if(s.title.toLowerCase().includes(this.searchKey.toLowerCase())){
          this.dua.push(s);
        }
      })
    }else if(this.slide.activeIndex == 1){
      this.salawat = [];
      this.PermSalawat.forEach((s: any)=>{
        if(s.title.toLowerCase().includes(this.searchKey.toLowerCase())){
          this.salawat.push(s);
        }
      })

    }

  }else{
      this.vis = "hidden";
      this.dua = this.PermDua;
      this.salawat = this.PermSalawat;

  }
}

clearSearch(){
  // //console.log('Clicked ', this.Permevidence);
  this.searchKey = '';
}

setViewModel(state: boolean){
  this.isModalOpen = state;
}
setEditModel(state: boolean){
  if(!state){
    this.dua = this.PermDua;
    this.salawat = this.PermSalawat;
  }
  this.isEditOpen = state;

}

promo(data: any){
  this.currAwraath = data;
  this.setViewModel(true);
}

Title: String;

editDetail(data: any){
  //console.log(data);
 // this.editAwraath = data;
 this.editAwraath.docid = data.docid;
  this.editAwraath.title = data.title;
  this.editAwraath.content = data.content;
  this.editAwraath.meaning = data.meaning;
  this.editAwraath.benifit = data.benifit;
  this.editAwraath.type = data.type;


  //console.log(this.editAwraath);


  this.setEditModel(true);
}
async deleteAwrath(data: any){
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
             this.db.deleteDuaFireBase(data).then(()=>{
                this.spinner = false;
                  this.utilService.successToast('Deleted successfully','trash-outline','warning');
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

update(){
  if(this.net){
    this.spinner = true;
    this.isEditOpen = false;
    this.db.updateDuaFireBase(this.editAwraath).then(()=>{
      this.spinner = false;
      this.utilService.successToast('Updated successfully','thumbs-up-outline','success');
    }).catch(er =>{
      this.spinner = false;
      this.utilService.erroToast('Something Went Wrong', 'bug-outline');
    });
  }else{
    this.utilService.NetworkToast();
  }
}


}
