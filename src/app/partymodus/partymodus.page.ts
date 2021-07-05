import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IdService } from '../id.service';
import { AllPartyData, SpeicherService } from '../speicher.service';

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
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.id = this.idService.getPartyID();
    this.partymodusStatus = this.speicherService.getPartymodusStatus(this.id);
    this.showCocktails(this.id);
  }

  async showCocktails(partyID){
    this.cocktailPromise = this.speicherService.getCocktails(partyID);
  }

  removeCocktail(cocktail) {
    this.speicherService.removeCocktail(this.id, cocktail);
    this.showCocktails(this.id);
  }

  togglePartymodus(){
    this.speicherService.partymodusStarten(this.id, this.partymodusStatus);
  }
}
