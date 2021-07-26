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
export class ListenPage implements OnInit {

  private essenPromise: Promise<AllPartyData[]>;
  private trinkenPromise: Promise<AllPartyData[]>;
  private sonstigesPromise: Promise<AllPartyData[]>;
  private id;

  constructor(
    private alertCtrl: AlertController,
    private speicherService: SpeicherService,
    private idService: IdService
  ) {
  }

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

  async showLists(partyID) {
    this.essenPromise = this.speicherService.getEssen(partyID);
    this.trinkenPromise = this.speicherService.getTrinken(partyID);
    this.sonstigesPromise = this.speicherService.getSonstiges(partyID);
  }

  removeEssen(essen) {
    this.speicherService.removeEssen(this.id, essen);
    this.showLists(this.id);
  }
  removeTrinken(trinken) {
    this.speicherService.removeTrinken(this.id, trinken);
    this.showLists(this.id);
  }
  removeSonstiges(sonstiges) {
    this.speicherService.removeSonstiges(this.id, sonstiges);
    this.showLists(this.id);
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.id = this.idService.getPartyID();
    this.showLists(this.id);
  }

  async userAnzeigen(user){
    if (user==''){
      user="Kein User zugeteilt"
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
