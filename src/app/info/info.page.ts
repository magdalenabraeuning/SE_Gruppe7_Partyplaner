import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AllPartyData, SpeicherService } from '../speicher.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  private title: string;
  private description: string;
  private address: string;
  private date: string;
  private time: string;
  private id: string;

  private teilnehmerPromise: Promise<AllPartyData[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private speicherService: SpeicherService,
  ) {
    /*this.title = activatedRoute.snapshot.queryParamMap.get("title");
    this.description = activatedRoute.snapshot.queryParamMap.get("description");
    this.address = activatedRoute.snapshot.queryParamMap.get("address");
    this.date = activatedRoute.snapshot.queryParamMap.get("date");
    this.time = activatedRoute.snapshot.queryParamMap.get("time");
  */}

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log("WILL ENTER")
    this.title = this.activatedRoute.snapshot.queryParamMap.get("title");
    this.description = this.activatedRoute.snapshot.queryParamMap.get("description");
    this.address = this.activatedRoute.snapshot.queryParamMap.get("address");
    this.date = this.activatedRoute.snapshot.queryParamMap.get("date");
    this.time = this.activatedRoute.snapshot.queryParamMap.get("time");
    this.id = this.activatedRoute.snapshot.queryParamMap.get("id");
    this.showTeilnehmer(this.id);
  }


  async addTeilnehmer(partyID) {
    this.alertCtrl.create({
      message: "Teilnehmer hinzufügen",
      inputs: [
        { type: 'textarea', name: 'userMail', placeholder: "E-Mail des Users eingeben" },
      ],
      buttons: [
        {
          text: 'Add',
          handler: (res) => {
            console.log(res);
            this.speicherService.addTeilnehmer(this.id, res.userMail);
            this.showTeilnehmer(this.id);
          }
        }, {
          text: 'Cancel'
        }
      ]
    }).then(a => a.present());
  }

  async showTeilnehmer(partyID) {
    this.teilnehmerPromise = this.speicherService.getTeilnehmer(partyID);
    console.log("HAAAAAAAALLOOOO" + await this.teilnehmerPromise);
  }

  removeTeilnehmer(partyID, user) {

    this.speicherService.removeTeilnehmer(partyID, user);
    this.showTeilnehmer(this.id);

  }





}
