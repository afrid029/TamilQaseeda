import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtillService {
  onlineIndicator: boolean;

  constructor(private toast: ToastController) { }

  async erroToast(message: string,icon: string){
    const to = await this.toast.create({
      message: message,
      icon: icon,
      duration:3500,
      position:'bottom',
      color:'danger'
    });

    to.present();
  }

  async successToast(message: string,icon: string,color: string){
    const to = await this.toast.create({
      message: message,
      icon: icon,
      duration:3500,
      position:'bottom',
      color:color
    });

    to.present();
  }

  async NetworkToast(){
    const to = await this.toast.create({
      message: "Network is not available",
      icon: 'cloud-offline',
      duration:3500,
      position:'bottom',
      color:'danger'
    });

    to.present();
  }


}
