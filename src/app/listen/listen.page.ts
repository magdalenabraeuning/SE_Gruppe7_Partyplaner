import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AllPartyData, SpeicherService } from '../speicher.service';
import { IdService } from '../id.service';


@Component({
  selector: 'app-listen',
  templateUrl: './listen.page.html',
  styleUrls: ['./listen.page.scss'],
})
export class ListenPage {

  //Variablen
  private essenPromise: Promise<AllPartyData[]>;
  private trinkenPromise: Promise<AllPartyData[]>;
  private sonstigesPromise: Promise<AllPartyData[]>;
  private id;

  //Konstruktor zum Initialisieren der benötigten Services
  constructor(
    private alertCtrl: AlertController,
    private speicherService: SpeicherService,
    private idService: IdService
  ) { }

  //Hinzufügen (Speichern) eines Items zu den Listen "Essen", "Trinken" oder "Sonstiges"
  addItem() {
    this.alertCtrl.create({
      message: "Kategorie wählen",
      inputs: [
        {
          type: 'radio',
          label: 'Essen',
          value: 'Essen',
          checked: true
        },
        {
          type: 'radio',
          label: 'Trinken',
          value: 'Trinken'
        },
        {
          type: 'radio',
          label: 'Sonstiges',
          value: 'Sonstiges'
        },
      ],
      buttons: [
        {
          text: 'Weiter',
          handler: (kategorie) => {
            this.alertCtrl.create({
              message: "Item hinzufügen",
              inputs: [
                { type: 'text', name: 'itemName', placeholder: "Name" },
                { type: 'textarea', name: 'itemMenge', placeholder: "Menge" },
                { type: 'textarea', name: 'itemUser', placeholder: "User" }
              ],
              buttons: [
                {
                  text: 'Add',
                  handler: (res) => {
                    if (kategorie === "Essen") {
                      this.speicherService.addEssen(this.id, { name: res.itemName, menge: res.itemMenge, user: res.itemUser });
                    } else if (kategorie === "Trinken") {
                      this.speicherService.addTrinken(this.id, { name: res.itemName, menge: res.itemMenge, user: res.itemUser });
                    } else if (kategorie === "Sonstiges") {
                      this.speicherService.addSonstiges(this.id, { name: res.itemName, menge: res.itemMenge, user: res.itemUser });
                    } else {
                      console.log("Error at SpeicherService");
                    }
                    this.showLists(this.id);
                  }
                }, {
                  text: 'Cancel'
                }
              ]
            }).then(a => a.present());
          }
        }, {
          text: 'Cancel'
        }
      ]
    }).then(a => a.present());
  }

  //Abrufen der Listen "Essen", "Trinken" und "Sonstiges" der Party "partyID" vom SpeicherService
  async showLists(partyID) {
    this.essenPromise = this.speicherService.getEssen(partyID);
    this.trinkenPromise = this.speicherService.getTrinken(partyID);
    this.sonstigesPromise = this.speicherService.getSonstiges(partyID);
  }

  //Löschen des Items "essen" aus der Liste "Essen"
  removeEssen(essen) {
    this.speicherService.removeEssen(this.id, essen);
    this.showLists(this.id);
  }

  //Löschen des Items "trinken" aus der Liste "Trinken"
  removeTrinken(trinken) {
    this.speicherService.removeTrinken(this.id, trinken);
    this.showLists(this.id);
  }

  //Löschen des Items "sonstiges" aus der Liste "Sonstiges"
  removeSonstiges(sonstiges) {
    this.speicherService.removeSonstiges(this.id, sonstiges);
    this.showLists(this.id);
  }

  //Beim Aufrufen der Page wird die entsprechende Party-ID vom IDService abgerufen und die Methode showLists() aufgerufen 
  ionViewWillEnter() {
    this.id = this.idService.getPartyID();
    this.showLists(this.id);
  }

  //Beim Anklicken eines Eintrags einer Liste wird der zugeteilte User ausgegeben
  async userAnzeigen(user) {
    if (user == '') {
      user = "Kein User zugeteilt"
    }
    this.alertCtrl.create({
      header: "Zugeteilter User:",
      message: user,
      buttons: [
        {
          text: 'Ok',
        }
      ]
    }).then(a => a.present());
  }
}
