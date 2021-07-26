import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, LoadingController } from '@ionic/angular';
import { SpeicherService } from '../speicher.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-partys',
  templateUrl: './partys.page.html',
  styleUrls: ['./partys.page.scss'],
})
export class PartysPage implements OnInit {

  tasks: any = [];
  userProfileCollection;
  partyArr: any[];
  partyData: any = [];
  allIDs: any = [];
  partyArrObsrv: Subject<any> = new Subject<any>();
  myEventList: any;

  constructor(
    public afAuth: AngularFireAuth,
    public afFirestore: AngularFirestore,
    private alertCtrl: AlertController,
    private speicherService: SpeicherService,
    private navCtrl: NavController,
    public loadingController: LoadingController,
    private toastService: ToastService
  ) { }

  signOut() {
    this.afAuth.signOut().then(() => {
      let navigationTarget = `/home`;
      this.navCtrl.navigateForward(navigationTarget);
    });
  }


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
            await this.speicherService.addParty(res).then(() => {
              setTimeout(() => this.fetch(), 1000);
              setTimeout(() => this.fetch(), 1000);
            });
            this.toastService.presentToast("Party wurde gespeichert.");
          }
        }, {
          text: 'Cancel',
          handler: () => {
            this.toastService.presentToast("Speichern wurde abgebrochen.");
          }
        }
      ]
    }).then(a => { a.present() });
  }

  ngOnInit() {
    this.presentLoading();
    try {
      setTimeout(() => this.fetch(), 4000);
    } catch (e) {
      console.log("Fehler beim Laden");
    }
  }

  ionViewDidEnter() {
    this.fetch();
  }

  pruefeUserVorhanden(userID) {
    let userVorhanden = false;
    for (let j = 0; j < this.allIDs.length; j++) {
      if (this.allIDs[j].id == userID) {
        userVorhanden = true;
      }
    }
    return userVorhanden;
  }

  async fetch() {
    this.partyData = [];
    try {
      this.partyData = await this.speicherService.loadAllData();
    } catch (e) {
      console.log(e);
    }
  }

  updateButton(id, status) {
    this.speicherService.updateStatus(id, status);
  }

  bearbeitenButton(id, oldTitle, oldDescription, oldAddress, oldDate, oldTime) {
    let date: Date = oldDate;
    this.alertCtrl.create({
      message: "Party bearbeiten",
      inputs: [
        { type: 'text', name: 'title', placeholder: `${oldTitle}`, value: `${oldTitle}` },
        { type: 'textarea', name: 'description', placeholder: `${oldDescription}`, value: `${oldDescription}` },
        { type: 'textarea', name: 'address', placeholder: `${oldAddress}`, value: `${oldAddress}` },
        {
          name: 'date',
          type: 'date',
          min: Date.now(),
          placeholder: `${date}`,
          value: `${date}`
        },
        { type: 'time', name: 'time', placeholder: `${oldTime}`, value: `${oldTime}` }
      ],
      buttons: [
        {
          text: 'Speichern',
          handler: async (res) => {
            await this.speicherService.updateParty(res, id);
          }
        }, {
          text: 'Cancel'
        }
      ]
    }).then(a => { a.present() });
  }


  async deleteButton(id) {

    const sicherheitsfrage = `Willst du diese Party wirklich löschen?`;

    const abbrechenButton = {
      text: "Abbrechen",
      role: "Cancel",
      handler: () => {
        this.toastService.presentToast("Löschen wurde abgebrochen.");
      }
    }

    const jaButton = {
      text: "Weiter",
      handler: async () => {
        this.partyData = [];
        await this.speicherService.delete(id);
        this.fetch();
        this.toastService.presentToast("Party wurde gelöscht.");
      }
    }

    const meinAlert = await this.alertCtrl.create({
      cssClass: 'dialoge',
      header: "Sicherheitsfrage",
      message: sicherheitsfrage,
      backdropDismiss: false,
      buttons: [jaButton, abbrechenButton]
    });
    await meinAlert.present();
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
    await loading.onDidDismiss();
    console.log('Loading dismissed');
  }

  doRefresh(event) {
    this.fetch();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}