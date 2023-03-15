import { Injectable, Injector } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Song } from '../add/Song';
import { map, Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtillService } from './utill.service';
import { ObsrService } from './obsr.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/internal/Subscription';



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
    private ngAuth: AngularFireAuth) {

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
  console.log(song);
  return this.afs.collection('songs').add(song).then((re: any)=>{
    console.log(re);
    return 'added'
  }).catch((er: any)=>{
    console.log('errr');
  });
}

// Update Song in Firebase
async updateFireBase(song: any){
  this.afs.collection('songs').doc(song.docid).set(song);
}


//Delete Song in Firebase
async deleteFireBase(song: any){
  const time = new Date().getTime();
  this.afs.collection('songs').doc(song.docid).delete();
}

/* Login */
LoginWithEmail(form: any){
  return this.ngAuth.signInWithEmailAndPassword(form.email, form.password);
}

/* Logout */
logout(){
  console.log(this.ngAuth.user);
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
      console.log(re);
      return 'added'
    }).catch((er: any)=>{
      console.log('errr');
    });
  }else{
    return this.afs.collection('ziyaramRequests').add(data).then((re: any)=>{
      console.log(re);
      return 'added'
    }).catch((er: any)=>{
      console.log('errr');
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
  this.a = this.afs.collection(`ziyaramRequests`).doc(ziyaram.docid).get().subscribe((re: any)=>{
    if(re.exists){
      this.afs.collection(`ziyaramRequests`).doc(ziyaram.docid).delete();
    }

  })
  this.a.unsubscribe();
}


//Delete Ziyaram in Firebase
async deleteZiyaramFireBase(ziyaram: any){
  const time = new Date().getTime();
  this.afs.collection('ziyarams').doc(ziyaram.docid).delete();
}

async deleteZiyaramRequestFirebase(ziyaram: any){
  this.afs.collection('ziyaramRequest').doc(ziyaram.docid).delete().then(()=>{
    return 'deleted'
  }).catch((er: any)=>{
    return 'error';
  });
}

/********************************Evidance*********************** */
//Add Evidence
addEvidenceDetail(data: any){
  return this.afs.collection('evidence').add(data).then((re: any)=>{
    console.log(re);
    return 'added'
  }).catch((er: any)=>{
    console.log('errr');
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
  const time = new Date().getTime();
  this.afs.collection('evidence').doc(evidence.docid).delete();
}
/* *******************************Calendar Detail******************************************/

addCalendarDetail(data: any){
  return this.afs.collection('calendar').add(data).then((re: any)=>{
    console.log(re);
    return 'added'
  }).catch((er: any)=>{
    console.log('errr');
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
  this.afs.collection('calendar').doc(calendar.docid).set(calendar);
}


//Delete Calendar in Firebase
async deletecalendarFireBase(evidence: any){
  const time = new Date().getTime();
  this.afs.collection('calendar').doc(evidence.docid).delete();
}

/* *******************************Duas Detail******************************************/

//Add Dua
addDuaDetail(data: any){
    return this.afs.collection('duas').add(data).then((re: any)=>{
      console.log(re);
      return 'added'
    }).catch((er: any)=>{
      console.log('errr');
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
  const time = new Date().getTime();
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

async updateAlertContent(data: any){
  this.afs.collection('alerts').doc(data.docid).set(data);
}

async deleteAlertContent(data: any){
  this.afs.collection('alerts').doc(data.docid).delete();
}

getTodayContent(){
  const dt = Date.parse(new Date().toDateString());
  console.log(dt);
  console.log(new Date(dt));
  return this.afs.collection('alerts',ref => {
    return ref.where('date', '==', dt);
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



