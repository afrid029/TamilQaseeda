import { Injectable, Injector } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtillService } from './utill.service';
import { ObsrService } from './obsr.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/internal/Subscription';
import { AngularFireStorage } from '@angular/fire/compat/storage';




@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  oldSong: any=[];
  oldZiyaram: any=[];
  oldEvidence: any = [];
  oldCalendar: any=[];
  oldDua: any=[];
  // ngAuth: any;
  // afs: any;
  network: Boolean;

  user: boolean = false;
  constructor(
    private toast: ToastController,
    private utilService:UtillService,
    private obsr: ObsrService,
    private injector:Injector, private datePipe: DatePipe, private afs: AngularFirestore,
    private ngAuth: AngularFireAuth, private storage: AngularFireStorage) {

      this.obsr.network.subscribe(re=>{
        this.network = re;

      })

      this.obsr.user.subscribe(re=>{
        this.user = re;
      });


     }


/* Songs */

//Get From Firestore
getSong(type: String){
  return this.afs.collection(`songs`,ref=>{
    return ref.where('type','==',type).orderBy('title');
  }).snapshotChanges().pipe(
      map((actions: any)=>{
        return actions.map((a: any)=>{
          const data = a.payload.doc.data();
          const docid = a.payload.doc.id;
          return {docid, ...data}
        })
      })
    );
}



// Add Song into Firebase
sendToFirebase(song: any){
  //console.log(song);
  return this.afs.collection('songs').add(song).then((re: any)=>{
    //console.log(re);
    return 'added'
  }).catch((er: any)=>{
    //console.log('errr');
  });
}

// Update Song in Firebase
async updateFireBase(song: any){
  this.afs.collection('songs').doc(song.docid).set(song);
}


//Delete Song in Firebase
async deleteFireBase(song: any){
  this.afs.collection('songs').doc(song.docid).delete();
}

/* Login */
LoginWithEmail(form: any){
  return this.ngAuth.signInWithEmailAndPassword(form.email, form.password);
}

/* Logout */
logout(){
  //console.log(this.ngAuth.user);
  return this.ngAuth.signOut();
}

/* Get authenticated user */
getUser(){
  if(this.network){
    return this.ngAuth.user;
  }else{
    return null
  }
}

/* Set user in localstorage */
setUser(user: any){
  localStorage.setItem('user',user);
}


/* *******************************Ziyaram Detail******************************************/


//Add Ziyaram
addZiyaramDetail(data: any){
  if(this.user){
    return this.afs.collection('ziyarams').add(data).then((re: any)=>{
      //console.log(re);
      return 'added'
    }).catch((er: any)=>{
      //console.log('errr');
    });
  }else{
    return this.afs.collection('ziyaramRequests').add(data).then((re: any)=>{
      //console.log(re);
      return 'added'
    }).catch((er: any)=>{
      //console.log('errr');
    });
  }

}

//Get All Ziyaram From fire
getZiyarams(){

  return this.afs.collection(`ziyarams`,ref=>{
    return ref.orderBy('name');
  }).snapshotChanges().pipe(
      map((actions: any)=>{
        return actions.map((a: any)=>{
          const data = a.payload.doc.data();
          const docid = a.payload.doc.id;
          return {docid, ...data}
        })
      })
    );
}

//Get Ziyaram Requests From Fire
getZiyaramRequests(){
  return this.afs.collection(`ziyaramRequests`).snapshotChanges().pipe(
    map((actions: any)=>{
      return actions.map((a: any)=>{
        const data = a.payload.doc.data();
        const docid = a.payload.doc.id;
        return {docid,...data}
      })
    })
  )
}

// Update Ziyaram in Firebase
a: Subscription;
async updateZiyaramFireBase(ziyaram: any){
  this.afs.collection('ziyarams').doc(ziyaram.docid).set(ziyaram);
 // alert('Updated ziyaram');
  this.afs.collection('ziyaramRequests').doc(ziyaram.docid).get().subscribe((re)=>{
    //console.log(re.exists);

    if(re.exists){



      this.afs.collection('ziyaramRequests').doc(ziyaram.docid).delete();

    }



  });
}


//Delete Ziyaram in Firebase
async deleteZiyaramFireBase(ziyaram: any){
  this.afs.collection('ziyarams').doc(ziyaram.docid).delete().then(()=>{
    this.storage.storage.refFromURL(ziyaram.imageUrl).delete();
  });

}

async deleteZiyaramRequestFirebase(ziyaram: any){
  this.afs.collection('ziyaramRequests').doc(ziyaram.docid).delete().then(()=>{
    this.storage.storage.refFromURL(ziyaram.imageUrl).delete();
    return 'deleted'
  }).catch((er: any)=>{
    return 'error';
  });
}

/********************************Evidance*********************** */
//Add Evidence
addEvidenceDetail(data: any){
  return this.afs.collection('evidence').add(data).then((re: any)=>{
    //console.log(re);
    return 'added'
  }).catch((er: any)=>{
    //console.log('errr');
  });
}


//Get All Evidence From fire
getEvidence(){
  return this.afs.collection(`evidence`, ref=>{
    return ref.orderBy('title');
  }).snapshotChanges().pipe(
      map((actions: any)=>{
        return actions.map((a: any)=>{
          const data = a.payload.doc.data();
          const docid = a.payload.doc.id;
          return {docid, ...data}
        })
      })
    );
}

// Update Evidence in Firebase
async updateEvidenceFireBase(evidence: any){
  this.afs.collection('evidence').doc(evidence.docid).set(evidence);
}


//Delete Evidence in Firebase
async deleteaevidenceFireBase(evidence: any){
  this.afs.collection('evidence').doc(evidence.docid).delete();
}
/* *******************************Calendar Detail******************************************/

addCalendarDetail(data: any){
  return this.afs.collection('calendar').add(data).then((re: any)=>{
    //console.log(re);
    return 'added'
  }).catch((er: any)=>{
    //console.log('errr');
  });
}
//Get All Calendar From fire
getCalendar(){
  return this.afs.collection(`calendar`, ref => {
    return ref.orderBy('date');
  }).snapshotChanges().pipe(
      map((actions: any)=>{
        return actions.map((a: any)=>{
          const data = a.payload.doc.data();
          const docid = a.payload.doc.id;
          return {docid, ...data}
        })
      })
    );
}

// Update calendar in Firebase
async updateCalendarFireBase(calendar: any){

  ////console.log(calendar)
  this.afs.collection('calendar').doc(calendar.docid).set(calendar);
}


//Delete Calendar in Firebase
async deletecalendarFireBase(evidence: any){
  this.afs.collection('calendar').doc(evidence.docid).delete();
}

//Refresh Calender

async refreshCalendar(event: any[]){
  ////console.log(event);
  //return this.afs.collection('calendar').doc(event.docid).set(event);
  return event.forEach(data =>{
      this.afs.collection('calendar').doc(data.docid).update({
        date: data.date
      }).then(()=>{
        //console.log('Updated');
        this.utilService.successToast("All Calendar events updated successfully","document-lock-outline","favorite")

      }).catch(er =>{

       //console.log(er);

        this.afs.collection('Error').add({
          docid: data.docid,
          content: data.content,
          isl: data.isl,
          date: data.date,
          error: er.message
        });

        this.utilService.erroToast("Something went wrong. Kindly inform to DBA","construct-outline")

      })
    })
}



/* *******************************Duas Detail******************************************/

//Add Dua
addDuaDetail(data: any){
    return this.afs.collection('duas').add(data).then((re: any)=>{
      //console.log(re);
      return 'added'
    }).catch((er: any)=>{
      //console.log('errr');
    });
}

//Get All Duas From fire
getDuas(){
  return this.afs.collection(`duas`, ref => {
    return ref.orderBy('title');
  }).snapshotChanges().pipe(
      map((actions: any)=>{
        return actions.map((a: any)=>{
          const data = a.payload.doc.data();
          const docid = a.payload.doc.id;
          return {docid, ...data}
        })
      })
    );
}


// Update Dua in Firebase
async updateDuaFireBase(dua: any){
  this.afs.collection('duas').doc(dua.docid).set(dua);
}


//Delete Dua in Firebase
async deleteDuaFireBase(dua: any){
  this.afs.collection('duas').doc(dua.docid).delete();
}



/*************************First ALert Dialog******************** */
sendAlertContent(data: any){
  return this.afs.collection('alerts').add(data).then((re: any)=>{
    return 'added';
  }).catch((err: any)=>{
    this.utilService.erroToast('Something went wrong','storefront-outline');
  })
}

getAlertContent(){
  return this.afs.collection('alerts',ref => {
    return ref.orderBy('date','desc');
  }).snapshotChanges().pipe(
    map((data: any)=>{
     return data.map((a: any)=>{
        const docid = a.payload.doc.id;
        const doc = a.payload.doc.data();
        return {docid, ...doc};
      })
    })
  )
}


async deleteAlertContent(data: any){
  this.afs.collection('alerts').doc(data.docid).delete();
  data.imageUrl.forEach((url: any) =>{
    this.storage.storage.refFromURL(url).delete();
  })
}

getTodayContent(){
  // const dt = Date.parse(new Date().toDateString());
  // console.log(dt);

  const now = new Date();

  const startOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)).getTime();

    // Calculate the end of the current day in UTC
    const endOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999)).getTime();

  //console.log(new Date(dt));
  return this.afs.collection('alerts',ref => {
    return ref.where('date', '>=', startOfDayUTC)
    .where('date', '<=', endOfDayUTC);
  }).snapshotChanges().pipe(
    map((data: any)=>{
     return data.map((a: any)=>{
        const docid = a.payload.doc.id;
        const doc = a.payload.doc.data();
        return {docid, ...doc};
      })
    })
  )

}


/*************************Floating Banner Content******************** */
sendBannerContent(data: any){
  return this.afs.collection('banner').add(data).then((re: any)=>{
    return 'added';
  }).catch((err: any)=>{
    this.utilService.erroToast('Something went wrong','storefront-outline');
  })
}

getBannerContent(){
  return this.afs.collection('banner',ref => {
    return ref.orderBy('date','desc');
  }).snapshotChanges().pipe(
    map((data: any)=>{
     return data.map((a: any)=>{
        const docid = a.payload.doc.id;
        const doc = a.payload.doc.data();
        return {docid, ...doc};
      })
    })
  )
}

async updateBannerContent(data: any){
  this.afs.collection('banner').doc(data.docid).set(data);
}

async deleteBannerContent(data: any){
  this.afs.collection('banner').doc(data.docid).delete();
}

getTodayBannerContent(){
  const now = new Date();

  const startOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)).getTime();

    // Calculate the end of the current day in UTC
    const endOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999)).getTime();

  return this.afs.collection('banner',ref => {
    return ref.where('date', '>=', startOfDayUTC)
    .where('date', '<=', endOfDayUTC);
  }).snapshotChanges().pipe(
    map((data: any)=>{
     return data.map((a: any)=>{
        const docid = a.payload.doc.id;
        const doc = a.payload.doc.data();
        return {docid, ...doc};
      })
    })
  )

}


/*************************QnA Section********************** */
AddQnA(data: any){
  return this.afs.collection('qna').add(data).then((re: any)=>{
    //console.log(re);
    return 'added'
  }).catch((er: any)=>{
    //console.log('errr');
  });
}

GetforAdmin(){
  return this.afs.collection('qna',ref => {
    return ref.orderBy('number','desc');
  }).snapshotChanges().pipe(
    map((data: any)=>{
     return data.map((a: any)=>{
        const docid = a.payload.doc.id;
        const doc = a.payload.doc.data();
        return {docid, ...doc};
      })
    })
  )
}

GetforUsers(){
  const dt = Date.parse(new Date().toDateString());
  const now = new Date();

  const startOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)).getTime();

    // Calculate the end of the current day in UTC
    const endOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999)).getTime();

  //console.log(dt);
  //console.log(new Date(dt));
  return this.afs.collection('qna',ref => {
    return ref.where('startDate', '>=', startOfDayUTC).where('startDate', '<=',endOfDayUTC).orderBy('startDate','desc').orderBy('number', 'desc');
  }).snapshotChanges().pipe(
    map((data: any)=>{
     return data.map((a: any)=>{
        const docid = a.payload.doc.id;
        const doc = a.payload.doc.data();
        return {docid, ...doc};
      })
    })
  )
}

async UpdateQnA(data: any){
  this.afs.collection('qna').doc(data.docid).set(data);
}

async deleteQnA(evidence: any){
  this.afs.collection('qna').doc(evidence.docid).delete();
}

AlreadySentOrNot(mobile: any, data: any){

  console.log(typeof(mobile));
  console.log(data);


  return this.afs.collection('response', ref=> {
    return ref.where('quizid','==',data.docid).where('user.mobile','==',mobile);
  }).get();
}

SubmitResponse(data: any){
  return this.afs.collection('response').add(data).then((re: any)=>{
    //console.log(re);
    return 'added'
  }).catch((er: any)=>{
    //console.log('errr');
  });
}

getResponseforQuiz(data: any){
  return this.afs.collection('response',ref => {
    return ref.where('quizid','==',data.docid).orderBy('date','desc');
  }).snapshotChanges().pipe(
    map((data: any)=>{
     return data.map((a: any)=>{
        const docid = a.payload.doc.id;
        const doc = a.payload.doc.data();
        return {docid, ...doc};
      })
    })
  )
}

}



