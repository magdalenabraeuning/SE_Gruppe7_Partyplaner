import { Subject } from 'rxjs';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, LoadingController } from '@ionic/angular';
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
  selector: 'app-partys',
  templateUrl: './partys.page.html',
  styleUrls: ['./partys.page.scss'],
})
export class PartysPage {

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
    private navCtrl: NavController,
    public loadingController: LoadingController
  ) { }

  signOut() {
    this.afAuth.signOut().then(() => {
      
      let navigationTarget =`/home`;
    this.navCtrl.navigateForward(navigationTarget);
    //location.reload();
    });
  }
  myEventList: any;

  async addParty(): Promise<any> {
    this.alertCtrl.create({
      message: "Party erstellen",
      inputs: [
        { type: 'text', name: 'title', placeholder: "Titel" },
        { type: 'textarea', name: 'description', placeholder: "Beschreibung" },
        { type: 'textarea', name: 'address', placeholder: "Adresse" },
        {
          name: 'date',
          type: 'date',
          min: Date.now(),
        },
        { type: 'time', name: 'time' }
      ],
      buttons: [
        {
          text: 'Add',
          handler: async (res) => {
            console.log(res);
            await this.speicherService.addParty(res).then(() => {
              setTimeout(() => this.fetch(), 1000);
              setTimeout(() => this.fetch(), 1000);
            });
          }
        }, {
          text: 'Cancel'
        }
      ]
    }).then(a => { a.present() });
  }


  ionViewDidEnter() {
    this.presentLoading();
    try {
      setTimeout(() => this.fetch(), 4000);
    } catch (e) {
      console.log("Fehler beim Laden");
    }
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
    this.partyData = [];
    try {
      this.partyData = await this.speicherService.loadAllData();
    } catch (e) {
      console.log(e);
      //throw new Error();
    }
  }

  updateButton(id, status) {
    this.speicherService.update(id, status);
  }

  async deleteButton(id) {
    this.partyData = [];
    await this.speicherService.delete(id);
    this.fetch();
  }

  openParty(party) {
    let navigationTarget =
      `/tabbar/info?title=${party.title}&description=${party.description}&address=${party.address}&date=${party.date}&time=${party.time}&id=${party.id}`;
    this.navCtrl.navigateForward(navigationTarget);

  }


  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 4000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  doRefresh(event) {
    this.fetch();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }



}