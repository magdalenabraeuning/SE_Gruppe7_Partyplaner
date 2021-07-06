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

  async ngOnInit() {
    this.id = this.idService.getPartyID();
    this.partymodusStatus = await this.speicherService.getPartymodusStatus(this.id);
  }

  async ionViewWillEnter() {
    console.log("id: "+this.id)
    await this.showCocktails(this.id);
      console.log("Status1: "+this.partymodusStatus)
      this.partymodusStatus = await this.speicherService.getPartymodusStatus(this.id);
      console.log("Status2: "+ this.partymodusStatus)
    
    
  }

  async showCocktails(partyID){
    this.cocktailPromise = this.speicherService.getCocktails(partyID);
  }

  removeCocktail(cocktail) {
    this.speicherService.removeCocktail(this.id, cocktail);
    this.showCocktails(this.id);
  }

  async togglePartymodus($event){
    
    this.speicherService.partymodusStarten(this.id, this.partymodusStatus);
    this.partymodusStatus = !this.partymodusStatus;
    //this.partymodusStatus = await this.speicherService.getPartymodusStatus(this.id);
    console.log("TOGGLE")
  }
}
