import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AllPartyData, SpeicherService } from '../speicher.service';
import { IdService } from '../id.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage {

  //Variablen
  private title: string;
  private description: string;
  private address: string;
  private date: string;
  private time: string;
  public id: string;
  private teilnehmerPromise: Promise<AllPartyData[]>;

  //Konstruktor zum Initialisieren der Services
  constructor(
    private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private speicherService: SpeicherService,
    private idService: IdService,
  ) {}

  //Partydaten werden beim Aufruf der Page von der Partys-Page empfangen
  ionViewWillEnter() {
    this.title = this.activatedRoute.snapshot.queryParamMap.get("title");
    this.description = this.activatedRoute.snapshot.queryParamMap.get("description");
    this.address = this.activatedRoute.snapshot.queryParamMap.get("address");
    this.date = this.activatedRoute.snapshot.queryParamMap.get("date");
    this.time = this.activatedRoute.snapshot.queryParamMap.get("time");
    this.id = this.activatedRoute.snapshot.queryParamMap.get("id");
    this.showTeilnehmer(this.id);
    this.idService.setPartyID(this.id);
  }

  //Ein Teilnehmer wird zur Party mit der ID "partyID" hinzugefügt
  async addTeilnehmer(partyID) {
    this.alertCtrl.create({
      message: "Teilnehmer hinzufügen",
      inputs: [
        { type: 'textarea', name: 'user', placeholder: "Name des Teilnehmers eingeben" },
      ],
      buttons: [
        {
          text: 'Add',
          handler: (res) => {
            this.speicherService.addTeilnehmer(this.id, res.user);
            this.showTeilnehmer(this.id);
          }
        }, {
          text: 'Cancel'
        }
      ]
    }).then(a => a.present());
  }

  //Die Teilnehmer der Party mit der ID "partyID" werden mithilfe des SpeicherServices abgerufen
  async showTeilnehmer(partyID) {
    this.teilnehmerPromise = this.speicherService.getTeilnehmer(partyID);
  }

  //Der Teilnehmer "user" wird von der Party mit der ID "partyID" entfernt
  removeTeilnehmer(partyID, user) {
    this.speicherService.removeTeilnehmer(partyID, user);
    this.showTeilnehmer(this.id);
  }
}
