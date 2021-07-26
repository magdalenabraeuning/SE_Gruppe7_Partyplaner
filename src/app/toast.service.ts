import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

//zentraler Service zum Erstellen von Toasts
export class ToastService {

  //Konstruktor zum Initialisieren des ToastControllers
  constructor(
    private toastController: ToastController) { }

  //Methode zum erstellen eines Toasts, der die übergebene Nachricht "myMessage" ausgibt
  async presentToast(myMessage) {
    const toast = await this.toastController.create({
      message: myMessage,
      duration: 2000
    });
    toast.present();
  }
}
