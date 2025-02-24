import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { OnlineStatusService } from 'ngx-online-status';
import { BehaviorSubject, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ObsrService {
  public network = new BehaviorSubject(false);
  public database = new BehaviorSubject(false);
  public user = new BehaviorSubject(false);
  public longtitude = new BehaviorSubject(-1);
  public latitude = new BehaviorSubject(-1);
  public MapClicked = new BehaviorSubject(false);
  public LocSelected = new BehaviorSubject(false);
  public genrelUser = new BehaviorSubject(false);
  public isPlaying = new BehaviorSubject(true);
  constructor(private online: OnlineStatusService,
    public afs: AngularFirestore) {
    if(this.online.getStatus()){
      //console.log("Connected");
      this.network.next(true);
    }else{
      //console.log("Disconnected");
      this.network.next(false);
    }
    this.online.status.subscribe(st =>{
      //console.log(st);
      if(st){
        this.network.next(true);
      }else{
        this.network.next(false);
      }
    })

    if(localStorage.getItem('user')){
      this.user.next(true);
    }else{
      this.user.next(false);
    }
  }


}
