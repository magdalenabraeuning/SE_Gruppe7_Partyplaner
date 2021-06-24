import { Subject } from 'rxjs';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { PartymodusPage } from '../partymodus/partymodus.page';
import { take } from 'rxjs/operators';
import { SpeicherService } from '../speicher.service';

export interface PartyForUser {
  Partys: [];
}

export interface AllPartyData {
  createdAt: number;
  desc: string;
  isDone: boolean;
  title: string;
  id: string;
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: any = [];
  userProfileCollection;
  partyArr: any[];
  partyData: any = [];
  allIDs: any = [];
  partyArrObsrv: Subject<any> = new Subject<any>();


  constructor(
    public afAuth: AngularFireAuth,
    public afFirestore: AngularFirestore,
    private alertCtrl: AlertController,
    private speicherService: SpeicherService,
  ) { }
  
  signOut() {
    this.afAuth.signOut().then(() => {
      location.reload();
    });
  }
  myEventList: any;

  async addParty() {

    this.alertCtrl.create({
      message: "Party erstellen",
      inputs: [
        { type: 'text', name: 'title' },
        { type: 'textarea', name: 'desc' }
      ],
      buttons: [
        {
          text: 'Add',
          handler: (res) => {
            console.log(res);
            this.speicherService.addParty(res);
          }
        }, {
          text: 'Cancel'
        }
      ]
    }).then(a => a.present());
  }



  ionViewDidEnter() { //this.fetch();
    console.log("ION VIEW DID ENTER")
  }

  pruefeUserVorhanden(userID) {
    let userVorhanden = false;
    for (let j = 0; j < this.allIDs.length; j++) {
      if (this.allIDs[j].id == userID) {
        userVorhanden = true;
      }
    }
    console.log("DAS IST MEIN USER?: " + userVorhanden)
    return userVorhanden;
  }

  async fetch() {
    this.partyData = await this.speicherService.loadAllData();
  }

  update(id, status) {
    this.afFirestore.collection("Partys").doc(id).update({
      isDone: !status
    });
  }

  async delete(id) {
    console.log("DELETE START")
    this.afFirestore.collection("Partys").doc(id).delete();
    let userID = (await this.afAuth.currentUser.then((user) => { return user.uid; }));
    this.afFirestore.collection("User").doc(userID).update({
      Partys: firebase.firestore.FieldValue.arrayRemove(id)
    });
    console.log("DELETE END")
  }

}

