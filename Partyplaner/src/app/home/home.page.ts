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


  async addParty(){
    let userID = (await this.afAuth.currentUser.then((user)=>{return user.uid;}));
    console.log(userID);
    
    this.alertCtrl.create({
      message: "Party erstellen",
      inputs:[
        { type: 'text', name: 'title'},
        { type: 'textarea', name: 'desc'}
      ],
      buttons:[
        {
          text: 'Add', 
          handler:(res) => {
            console.log(res);
            this.afFirestore.collection(userID).add({
              //statt userID oben "Partys" -> alle Partys auf der Ebene darunter
              
              title: res.title,
              desc: res.desc,
              createdAt: Date.now(),
              isDone: false
            });

          }
        }, {
          text: 'Cancel'
        }
      
      ]
    }).then(a => a.present());
  }



}
