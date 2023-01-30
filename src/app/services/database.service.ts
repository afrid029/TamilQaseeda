import { Injectable, Injector } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Song } from '../add/Song';
import { map } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { UtillService } from './utill.service';
import { ObsrService } from './obsr.service';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  databaseObj: SQLiteObject;
  oldSong: any=[];
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
    "SELECT * FROM song",[]
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
  const curTime = Number(localStorage.getItem('ref'));
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
  localStorage.setItem('ref',curTime.toString());
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


/******************************************* */

async deleteAll(){

  // localStorage.removeItem('ref');
  // await this.createDatabase();
  // return this.databaseObj.executeSql('delete from song',[]).then(()=>{
  //   return 'All Songs deleted successfully';
  // }).catch((e)=>{
  //  return 'Problem in deleteAll '+JSON.stringify(e)
  // })

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
  


  // this.databaseObj.executeSql(`drop table song`,[]).then((res)=>{
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


