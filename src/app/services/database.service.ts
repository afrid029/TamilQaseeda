import { Injectable, Injector } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Song } from '../add/Song';
import { map } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { UtillService } from './utill.service';
import { ObsrService } from './obsr.service';
import { ECDH } from 'crypto';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  databaseObj: SQLiteObject;
  oldSong: any=[];
  oldZiyaram: any=[];
  oldEvidence: any = [];
  oldCalendar: any=[];
  ngAuth: any;
  afs: any;
  network: Boolean;

  constructor(private sqlite: SQLite,
    private toast: ToastController,
    private utilService:UtillService,
    private obsr: ObsrService,
    private injector:Injector) {
      this.obsr.network.subscribe(re=>{
        this.network = re;
        if(re){
          this.afs = this.injector.get<AngularFirestore>(AngularFirestore);
          this.ngAuth = this.injector.get<AngularFireAuth>(AngularFireAuth);
        }else{
          this.afs = undefined;
          this.ngAuth = undefined;
        }
      })

      
     }

     /*Database and Table Creation*/
  async createDatabase(){
    console.log('hiiii');
    await this.sqlite.create({
      name: 'qaseedas',
      location: 'default'
  
  }).then((db: SQLiteObject)=> {
    console.log("OKk");
     this.databaseObj = db;
     this.obsr.database.next(true);
  }).catch((e) => {
    alert("Error in creatin databse "+JSON.stringify(e))
  });

}

async createTables(){
  console.log('Song Table');
  await this.databaseObj.executeSql(
    `create table if not exists song (docid TEXT PRIMARY KEY, title TEXT, content TEXT, author TEXT default Unknown, type TEXT, updatedDate INTEGER)`,[]
  ).then((res) => {
    console.log(res);
    
  }).catch((er) => {
    console.log(er);
    
  });

  console.log('Ziyaram Table')
  await this.databaseObj.executeSql(
    `create table if not exists ziyaram (docid TEXT PRIMARY KEY, name TEXT, description TEXT,location TEXT, day TEXT, long TEXT, lat TEXT,imageUrl TEXT, updatedDate INTEGER)`,[]
  ).then((res) => {
    console.log(res);
    
  }).catch((er) => {
    console.log(er);
    
  });

  console.log('Evidence Table')
  await this.databaseObj.executeSql(
    `create table if not exists evidence (docid TEXT PRIMARY KEY, title TEXT, content TEXT, type TEXT, updatedDate INTEGER)`,[]
  ).then((res) => {
    console.log(res);
    
  }).catch((er) => {
    console.log(er);
    
  });

  console.log('Calendar Table')
  await this.databaseObj.executeSql(
    `create table if not exists calendar (docid TEXT PRIMARY KEY, date DATE, content TEXT, updatedDate INTEGER)`,[]
  ).then((res) => {
    console.log(res);
    
  }).catch((er) => {
    console.log(er);
    
  });
}

/* SQL DML */

//ADD Song
async addSong(song: any){
  console.log(song);
  this.databaseObj.executeSql(
    'INSERT INTO song (docid, title, content, author, type,updatedDate) VALUES (?,?,?,?,?,?)',[song.docid, song.title, song.content, song.author, song.type,song.updatedDate]
  ).then((res) =>{
    
  }).catch((e) =>{
    if(e.code === 6){
      console.log('res1');
      return 'Song already exists'
    }
    console.log('res2 ', e.message);
    return 'error in add song '+JSON.stringify(e)  
  });
}

//Get Songs
async getSong(type: string){
  return this.databaseObj.executeSql(
    "SELECT * FROM song where type = ? order by title",[type]
  ).then((res) =>{
    console.log('results',res.rows.length);
    
    return res
  }).catch((e) =>{
    return 'error in getSong'
  });
}

//Delete Song
deleteSong(id: string){
  this.databaseObj.executeSql(
    `DELETE from song WHERE docid = ?`,[id]
  ).then(()=>{
    console.log('song deleted successfully');
    
  }).catch((e) =>{
    console.log('song errrrrrooror successfully', e);
  })
}

//Update Song
async updateSong(song: any){
  return this.databaseObj.executeSql(
    `Update song set title=?, content=?,author=?, type=?, updatedDate=? where docid=?`,[song.title,song.content,song.author,song.type,song.updatedDate,song.docid]
  ).then(()=>{
    return 'song Updated successfully'
  }).catch((e) =>{
    return 'error in Update song'
  })
}
//Get All Songs from SQL
getAllSong(){
  this.databaseObj.executeSql(
    "SELECT * FROM song order by updatedDate",[]
  ).then((res) =>{
    console.log('results',res.rows.length);
    for(var i=0; i< res.rows.length; i++) {
      this.oldSong.push(res.rows.item(i));
    }
     
  }).catch((e) =>{
    return 'error in getSong'
  });
}

/* Angular Firestore DML */

//Get From Firestore
getAllfromFire(){
  const curTime = Number(localStorage.getItem('songref'));
  console.log(curTime);
  return this.afs.collection(`songs`,(
    ref: { 
    where: (arg0: string, arg1: string, arg2: any) => 
      { (): any; new(): any; 
        orderBy: { (arg0: string, arg1: string): any; new(): any; }; 
    }; }
    )=>
    ref.where('updatedDate','>=',curTime).orderBy('updatedDate', 'asc')).snapshotChanges().pipe(
      map((actions: any)=>{
        return actions.map((a: any)=>{
          const data = a.payload.doc.data();
          const docid = a.payload.doc.id;
          return {docid, ...data}
        })
      })
    );
}

// Manipulate data to SQL from Firebase
getFromFireBase(){
  this.getAllSong();
  this.getAllfromFire().subscribe((re: any)=>{
    console.log('Length from db ', re.length);
    if(re.length > 0){
      for(var i = 0; i<re.length; i++){
        console.log(re[i]);
        console.log(this.oldSong);
        const check = this.oldSong.find((b: any) =>re[i].docid === b.docid);
        if(check){
          console.log('data found for ', check.docid);
          if(re[i].deleted){
            console.log(re[i]);
            console.log(check);
            this.deleteSong(check.docid);
          }else{
            if(re[i].author.length == 0){
              re[i].author = 'Unknown'
            }
            this.updateSong(re[i]);
          }
          
        }else{
          console.log('Data not found for', re[i].docid);
          if(re[i].author.length == 0){
            re[i].author = 'Unknown'
          }
          this.addSong(re[i]);
          
        }
      }
      this.utilService.successToast('Song List Updated','bookmark','success');
    }else{
      this.utilService.successToast('Song List Upto Date','cloud-done','tertiary');
  }
  });
 
  const curTime = new Date().getTime();
  localStorage.setItem('songref',curTime.toString());
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
async updateFireBase(song: Song){
  this.afs.collection('songs').doc(song.docid).set(song);   
}


//Delete Song in Firebase
async deleteFireBase(song: any){
  const time = new Date().getTime();
  this.afs.collection('songs').doc(song.docid).update({deleted: true, updatedDate: time});
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

/********SQL************** */

//ADD Ziyaram
async addZiyaram(ziyaram: any){
  console.log(ziyaram);
  this.databaseObj.executeSql(
    'INSERT INTO ziyaram (docid, name, description,location, day, long, lat, imageUrl, updatedDate) VALUES (?,?,?,?,?,?,?,?,?)',[ziyaram.docid, ziyaram.name, ziyaram.description,ziyaram.location, ziyaram.day, ziyaram.long, ziyaram.lat, ziyaram.imageUrl, ziyaram.updatedDate]
  ).then((res) =>{
    
  }).catch((e) =>{
    if(e.code === 6){
      console.log('res1');
      return 'Ziyaram Detail already exists'
    }
    console.log('res2 ', e.message);
    return 'error in add ziyaram '+JSON.stringify(e)  
  });
}

// Get Ziyaram
async getZiyarams(){
  return this.databaseObj.executeSql(
    "SELECT * FROM ziyaram order by name",[]
  ).then((res) =>{
    console.log('results',res.rows.length);
    
    return res
  }).catch((e) =>{
    return e.message;
  });
}

//Delete Ziyaram
deleteZiyaram(id: string){
  this.databaseObj.executeSql(
    `DELETE from ziyaram WHERE docid = ?`,[id]
  ).then(()=>{
    console.log('ziyaram deleted successfully');
    
  }).catch((e) =>{
    console.log('ziyaram deleted errrrrrooror ', e);
  })
}

//Update Ziyaram
async updateZiyaram(ziyaram: any){
  return this.databaseObj.executeSql(
    `Update ziyaram set name=?, description=?,location=?, day=?, long=?, lat=?, imageUrl=?, updatedDate=? where docid=?`,[ziyaram.name,ziyaram.description,ziyaram.location,ziyaram.day,ziyaram.long,ziyaram.lat, ziyaram.imageUrl,ziyaram.updatedDate,ziyaram.docid]
  ).then(()=>{
    console.log('successss ziyaram');
    
    return 'Ziyaram Updated successfully'
    
    
  }).catch((e) =>{
    console.log('error ziyaram ',e);
    
    return 'error in Update Ziyaram'
  })
}
//Get All Ziyaram from SQL
getAllZiyaram(){
  this.databaseObj.executeSql(
    "SELECT * FROM ziyaram order by updatedDate",[]
  ).then((res) =>{
    console.log('results',res.rows.length);
    for(var i=0; i< res.rows.length; i++) {
      this.oldZiyaram.push(res.rows.item(i));
    }
     
  }).catch((e) =>{
    return 'error in getZiyaram'
  });
}

/******FireStore************ */

//Add Ziyaram
addZiyaramDetail(data: any){
  return this.afs.collection('ziyarams').add(data).then((re: any)=>{
    console.log(re);
    return 'added'
  }).catch((er: any)=>{
    console.log('errr');
  });
}

//Get All Ziyaram From fire
getAllZiyaramfromFire(){
  const curTime = Number(localStorage.getItem('ziyaramref'));
  console.log(curTime);
  return this.afs.collection(`ziyarams`,(
    ref: { 
    where: (arg0: string, arg1: string, arg2: any) => 
      { (): any; new(): any; 
        orderBy: { (arg0: string, arg1: string): any; new(): any; }; 
    }; }
    )=>
    ref.where('updatedDate','>=',curTime).orderBy('updatedDate', 'asc')).snapshotChanges().pipe(
      map((actions: any)=>{
        return actions.map((a: any)=>{
          const data = a.payload.doc.data();
          const docid = a.payload.doc.id;
          return {docid, ...data}
        })
      })
    );
}

// Update Ziyaram in Firebase
async updateZiyaramFireBase(ziyaram: any){
  this.afs.collection('ziyarams').doc(ziyaram.docid).set(ziyaram);   
}


//Delete Ziyaram in Firebase
async deleteZiyaramFireBase(ziyaram: any){
  const time = new Date().getTime();
  this.afs.collection('ziyarams').doc(ziyaram.docid).update({deleted: true, updatedDate: time});
}

/****************Refresh Event************* */
async getZiyaramFromFireBase(){
  this.getAllZiyaram();
  this.getAllZiyaramfromFire().subscribe((re: any)=>{
    console.log('Length from db ', re.length);
    if(re.length > 0){
      for(var i = 0; i<re.length; i++){
        console.log(re[i]);
        console.log(this.oldZiyaram);
        const check = this.oldZiyaram.find((b: any) =>re[i].docid === b.docid);
        if(check){
          console.log('data found for ', check.docid);
          if(re[i].deleted){
            console.log(re[i]);
            console.log(check);
            this.deleteZiyaram(check.docid);
          }else{
            
            this.updateZiyaram(re[i]);
          }
          
        }else{
          console.log('Data not found for', re[i].docid);
          
          this.addZiyaram(re[i]);
          
        }
      }
      this.utilService.successToast('Ziyaram List Updated','bookmark','success');
     
    }else{
      this.utilService.successToast('Ziyaram List Upto Date','cloud-done','tertiary');
      
  }
  });
 
  const curTime = new Date().getTime();
  localStorage.setItem('ziyaramref',curTime.toString());

  //return true;
}

/* *******************************Evidence Detail******************************************/

/********SQL************** */
//ADD Evidence
async addEvidence(evidence: any){
  console.log(evidence);
  this.databaseObj.executeSql(
    'INSERT INTO evidence (docid, title, content, type, updatedDate) VALUES (?,?,?,?,?)',[evidence.docid, evidence.title, evidence.content, evidence.type, evidence.updatedDate]
  ).then((res) =>{
    
  }).catch((e) =>{
    if(e.code === 6){
      console.log('res1');
      return 'Evidence Detail already exists'
    }
    console.log('res2 ', e.message);
    return 'error in add evidence '+JSON.stringify(e)  
  });
}

// Get Evidence
async getEvidence(){
  return this.databaseObj.executeSql(
    "SELECT * FROM evidence order by title",[]
  ).then((res) =>{
    console.log('results',res.rows.length);
    
    return res
  }).catch((e) =>{
    return e.message;
  });
}

//Delete Evidence
deleteEvidence(id: string){
  this.databaseObj.executeSql(
    `DELETE from evidence WHERE docid = ?`,[id]
  ).then(()=>{
    console.log('Evidence deleted successfully');
    
  }).catch((e) =>{
    console.log('Evidence deleted errrrrrooror ', e);
  })
}

//Update Evidence
async updateEvidence(evidence: any){
  return this.databaseObj.executeSql(
    `Update evidence set title=?, content=?, type=?, updatedDate=? where docid=?`,[evidence.title,evidence.content,evidence.type,evidence.updatedDate,evidence.docid]
  ).then(()=>{
    return 'Evidence Updated successfully'
  }).catch((e) =>{
    return 'error in Update Evidence'
  })
}
//Get All Evidence from SQL
getAllEvidence(){
  this.databaseObj.executeSql(
    "SELECT * FROM evidence order by updatedDate",[]
  ).then((res) =>{
    console.log('results',res.rows.length);
    for(var i=0; i< res.rows.length; i++) {
      this.oldEvidence.push(res.rows.item(i));
    }
     
  }).catch((e) =>{
    return 'error in getEvidence'
  });
}

/******FireStore************ */
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
getAllEvidencefromFire(){
  const curTime = Number(localStorage.getItem('evidenceref'));
  console.log(curTime);
  return this.afs.collection(`evidence`,(
    ref: { 
    where: (arg0: string, arg1: string, arg2: any) => 
      { (): any; new(): any; 
        orderBy: { (arg0: string, arg1: string): any; new(): any; }; 
    }; }
    )=>
    ref.where('updatedDate','>=',curTime).orderBy('updatedDate', 'asc')).snapshotChanges().pipe(
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
  this.afs.collection('evidence').doc(evidence.docid).update({deleted: true, updatedDate: time});
}
/****************Refresh Event************* */
getEvidenceFromFireBase(){
  this.getAllEvidence();
  this.getAllEvidencefromFire().subscribe((re: any)=>{
    console.log('Length from db ', re.length);
    if(re.length > 0){
      for(var i = 0; i<re.length; i++){
        console.log(re[i]);
        console.log(this.oldEvidence);
        const check = this.oldEvidence.find((b: any) =>re[i].docid === b.docid);
        if(check){
          console.log('data found for ', check.docid);
          if(re[i].deleted){
            console.log(re[i]);
            console.log(check);
            this.deleteEvidence(check.docid);
          }else{
            
            this.updateEvidence(re[i]);
          }
          
        }else{
          console.log('Data not found for', re[i].docid);
        
          this.addEvidence(re[i]);
          
        }
      }
      this.utilService.successToast('Evidence List Updated','bookmark','success');
    }else{
      this.utilService.successToast('Evidence List Upto Date','cloud-done','tertiary');
  }
  });
 
  const curTime = new Date().getTime();
  localStorage.setItem('evidenceref',curTime.toString());
}

/* *******************************Calendar Detail******************************************/

/********SQL************** */
//ADD Calendar
async addCalendar(calendar: any){
  console.log(calendar);
  this.databaseObj.executeSql(
    'INSERT INTO calendar (docid, date, content, updatedDate) VALUES (?,?,?,?)',[calendar.docid, calendar.date, calendar.content, calendar.updatedDate]
  ).then((res) =>{
    
  }).catch((e) =>{
    if(e.code === 6){
      console.log('res1');
      return 'Calendar Detail already exists'
    }
    console.log('res2 ', e.message);
    return 'error in add calendar '+JSON.stringify(e)  
  });
}

// Get Calendar
async getCalendar(){
  return this.databaseObj.executeSql(
    "SELECT * FROM calendar order by date",[]
  ).then((res) =>{
    console.log('results',res.rows.length);
    
    return res
  }).catch((e) =>{
    return 'error in getCalendar'
  });
}

//Delete Calendar
deleteCalendar(id: string){
  this.databaseObj.executeSql(
    `DELETE from calendar WHERE docid = ?`,[id]
  ).then(()=>{
    console.log('Calendar deleted successfully');
    
  }).catch((e) =>{
    console.log('Calendar deleted errrrrrooror ', e);
  })
}

//Update Calendar
async updateCalendar(calendar: any){
  return this.databaseObj.executeSql(
    `Update calendar set date=?, content=?, updatedDate=? where docid=?`,[calendar.date,calendar.content,calendar.updatedDate,calendar.docid]
  ).then(()=>{
    return 'Calendar Updated successfully'
  }).catch((e) =>{
    return 'error in Update Calendar'
  })
}
//Get All Calendar from SQL
getAllCalendar(){
  this.databaseObj.executeSql(
    "SELECT * FROM calendar",[]
  ).then((res) =>{
    console.log('results',res.rows.length);
    for(var i=0; i< res.rows.length; i++) {
      this.oldEvidence.push(res.rows.item(i));
    }
     
  }).catch((e) =>{
    return 'error in getCalendar'
  });
}


/******FireStore************ */
addCalendarDetail(data: any){
  return this.afs.collection('calendar').add(data).then((re: any)=>{
    console.log(re);
    return 'added'
  }).catch((er: any)=>{
    console.log('errr');
  });
}



//Get All Calendar From fire
getAllCalendarfromFire(){
  const curTime = Number(localStorage.getItem('calendarref'));
  console.log(curTime);
  return this.afs.collection(`calendar`,(
    ref: { 
    where: (arg0: string, arg1: string, arg2: any) => 
      { (): any; new(): any; 
        orderBy: { (arg0: string, arg1: string): any; new(): any; }; 
    }; }
    )=>
    ref.where('updatedDate','>=',curTime).orderBy('updatedDate', 'asc')).snapshotChanges().pipe(
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
  this.afs.collection('calendar').doc(calendar.docid).set(calendar        );   
}


//Delete Calendar in Firebase
async deletecalendarFireBase(evidence: any){
  const time = new Date().getTime();
  this.afs.collection('calendar').doc(evidence.docid).update({deleted: true, updatedDate: time});
}

/***********Refresh Event*************/

getCalendarFromFireBase(){
  this.getAllCalendar();
  this.getAllCalendarfromFire().subscribe((re: any)=>{
    console.log('Length from db ', re.length);
    if(re.length > 0){
      for(var i = 0; i<re.length; i++){
        console.log(re[i]);
        console.log(this.oldCalendar);
        const check = this.oldCalendar.find((b: any) =>re[i].docid === b.docid);
        if(check){
          console.log('data found for ', check.docid);
          if(re[i].deleted){
            console.log(re[i]);
            console.log(check);
            this.deleteCalendar(check.docid);
          }else{
            
            this.updateCalendar(re[i]);
          }
          
        }else{
          console.log('Data not found for', re[i].docid);
        
          this.addCalendar(re[i]);
          
        }
      }
      this.utilService.successToast('Calendar List Updated','bookmark','success');
    }else{
      this.utilService.successToast('Calendar List Upto Date','cloud-done','tertiary');
  }
  });
 
  const curTime = new Date().getTime();
  localStorage.setItem('calendarref',curTime.toString());
}


/******************************************* */

async deleteAll(){

  localStorage.removeItem('songref');
  localStorage.removeItem('ziyaramref');
  localStorage.removeItem('calendarref');
  localStorage.removeItem('evidenceref');
  // //await this.createDatabase();
  return this.databaseObj.executeSql('delete from ziyaram',[]).then(()=>{
    return 'All Songs deleted successfully';

  }).catch((e)=>{
   return 'Problem in deleteAll '+JSON.stringify(e)
  })

//   console.log(this.curTime);
//   this.curTime = new Date().getTime();
// console.log(this.curTime);


  // const t = new Date();
  // console.log(t);
  // console.log(t.getTime());
  // setTimeout(()=>{
  //   const t1 = new Date(1243814960000);
  //   console.log(t1);
  // },3000)

  // const t = Number(localStorage.getItem('ref'));
  // console.log(typeof(t));
  // console.log(typeof(t.toString()));
  


  // this.databaseObj.executeSql(`drop table ziyaram`,[]).then((res)=>{
  //   console.log(res);
    
  // });

  // this.databaseObj.executeSql(
  //   "SELECT updatedDate FROM song",[]
  // ).then((res) =>{
  //   console.log('results',res.rows);
  //   //return res
  //   for(var i=0; i< res.rows.length; i++) {
      
  //     const t = new Date(Number(res.rows.item(i).updatedDate.substring(18,28)));
  //     console.log(t);
  //   }
  // }).catch((e) =>{
  //   return 'error in getSong'
  // });
}

// check(){
//   this.afs.collection('test').add({'id':'id','chec':'chec'});
//   console.log('hiiiiiiiiiiiiiiiii');
  
// }
}


