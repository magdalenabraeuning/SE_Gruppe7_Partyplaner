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

  private cocktailPromise: Promise<AllPartyData[]>;
  private id;
  private partymodusStatus;

  constructor(
    private speicherService: SpeicherService,
    private idService: IdService,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.id = this.idService.getPartyID();
    this.partymodusStatus = await this.speicherService.getPartymodusStatus(this.id);
  }

  async ionViewWillEnter() {
    await this.showCocktails(this.id);
    this.partymodusStatus = await this.speicherService.getPartymodusStatus(this.id);
  }

  async showCocktails(partyID) {
    this.cocktailPromise = this.speicherService.getCocktails(partyID);
  }

  removeCocktail(cocktail) {
    this.speicherService.removeCocktail(this.id, cocktail);
    this.showCocktails(this.id);
    this.toastService.presentToast("Cocktail wurde gelöscht.");
  }

  async togglePartymodus($event) {
    this.speicherService.partymodusStarten(this.id, this.partymodusStatus);
    this.partymodusStatus = !this.partymodusStatus;
    if (this.partymodusStatus == true){
      this.toastService.presentToast("Partymodus wurde gestartet.");
    } else{
      this.toastService.presentToast("Partymodus wurde beendet.");
    }
  }
}
