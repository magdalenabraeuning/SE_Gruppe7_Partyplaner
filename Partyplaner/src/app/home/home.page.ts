import { Subject } from 'rxjs';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { SpeicherService } from '../speicher.service';
import firebase from 'firebase/app';
import { NavController } from '@ionic/angular';

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
    private navCtrl : NavController,
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



  ionViewDidEnter() {
    //this.fetch();
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

  updateButton(id, status) {
    this.speicherService.update(id, status);
  }

  async deleteButton(id) {
    console.log("ID ID ID ID ID ID " + id);
    let test = await this.speicherService.delete(id);
  }

  openParty(party) {
    let navigationTarget =
    `/ergebnis?inputMenge`;
    this.navCtrl.navigateForward(navigationTarget);
  }








}

