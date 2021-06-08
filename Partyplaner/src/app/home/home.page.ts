import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

 

  constructor(
    public afAuth: AngularFireAuth,
    public afFirestore: AngularFirestore,
    private alertCtrl: AlertController
    ) {}

  signOut(){
    this.afAuth.signOut().then(() => {
      location.reload();
    });
  }


  addParty(){
    this.alertCtrl.create({
      message: "Party erstellen",
      inputs:[
        { type: 'text', name: 'title'},
        { type: 'textarea', name: 'desc'}
      ],
      buttons:[
        {
          text: 'Add', 
          handler:() => {

          }
        }, {
          text: 'Cancel'
        }
      
      ]
    }).then(a => a.present());
  }



}
