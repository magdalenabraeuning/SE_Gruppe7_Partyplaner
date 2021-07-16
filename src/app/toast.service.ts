import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastController: ToastController,
    private alertController: AlertController) { }

  async presentToast(myMessage) {
    const toast = await this.toastController.create({
      message: myMessage,
      duration: 2000
    });
    toast.present();
  }
}
