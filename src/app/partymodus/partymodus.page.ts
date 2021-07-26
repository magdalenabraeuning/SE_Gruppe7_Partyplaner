import { Component, OnInit } from '@angular/core';
import { IdService } from '../id.service';
import { AllPartyData, SpeicherService } from '../speicher.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-partymodus',
  templateUrl: './partymodus.page.html',
  styleUrls: ['./partymodus.page.scss'],
})
export class PartymodusPage implements OnInit {

  //Variablen
  private cocktailPromise: Promise<AllPartyData[]>;
  private id;
  private partymodusStatus;

  //Konstruktor zum Initialisieren der benötigten Services
  constructor(
    private speicherService: SpeicherService,
    private idService: IdService,
    private toastService: ToastService
  ) { }

  //Beim Initialisieren der Page wird die Party-ID vom IDService abgerufen und der Status 
  //des Partymodus (aktiviert/deaktiviert) vom SpeicherService abgerufen
  async ngOnInit() {
    this.id = this.idService.getPartyID();
    this.partymodusStatus = await this.speicherService.getPartymodusStatus(this.id);
  }

  //Beim Aufrufen der Page werden die gespeicherten Cocktaildaten und der Status des Partymodus abgerufen
  async ionViewWillEnter() {
    await this.showCocktails(this.id);
    this.partymodusStatus = await this.speicherService.getPartymodusStatus(this.id);
  }

  //Die gespeicherten Cocktails werden vom SpeicherService abgerufen
  async showCocktails(partyID) {
    this.cocktailPromise = this.speicherService.getCocktails(partyID);
  }

  //Der Cocktail "cocktail" wird aus dem Speicher gelöscht
  removeCocktail(cocktail) {
    this.speicherService.removeCocktail(this.id, cocktail);
    this.showCocktails(this.id);
    this.toastService.presentToast("Cocktail wurde gelöscht.");
  }

  //Aktivieren bzw. Deaktivieren des Partymodus
  async togglePartymodus($event) {
    this.speicherService.partymodusStarten(this.id, this.partymodusStatus);
    this.partymodusStatus = !this.partymodusStatus;
    if (this.partymodusStatus == true) {
      this.toastService.presentToast("Partymodus wurde gestartet.");
    } else {
      this.toastService.presentToast("Partymodus wurde beendet.");
    }
  }
}
