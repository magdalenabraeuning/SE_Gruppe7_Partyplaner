import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SpeicherService } from '../speicher.service';
import { IdService } from '../id.service';

@Component({
  selector: 'app-cocktail',
  templateUrl: './cocktail.page.html',
  styleUrls: ['./cocktail.page.scss'],
})
export class CocktailPage implements OnInit {

  searchTerm = "";
  IngArr : any [];
  private id;


  constructor(
    private httpClient: HttpClient,
    private speicherService: SpeicherService,
    private idService: IdService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private readonly basicURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
  private readonly searchURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
  private URL = "";
  private showList = true;
  readonly OPTIONS_OBJECT: object = { observe : "response"};
  private APIErrorMessage = "";
  private APIError = false;
  private cocktails: Promise<any[]>;
  private showSkeleton = true;
  private RandomC = true;

  private async loadData(){
    
    this.showSkeleton = true;
    this.APIError = false;
    if(this.searchTerm == ""){
      this.URL = this.basicURL;
      this.showList = true;
      this.httpClient.get(this.basicURL, this.OPTIONS_OBJECT).subscribe(this.verarbeiteHttpResponse, this.verarbeiteHttpFehler);
      this.RandomC=true;
    }
    else{
      this.URL = this.searchURL + this.searchTerm;
      this.showList = true;
      this.httpClient.get(this.URL, this.OPTIONS_OBJECT).subscribe(this.verarbeiteHttpResponse, this.verarbeiteHttpFehler);
      this.RandomC=false;
    }
  }

  private verarbeiteHttpResponse = (httpResponse: any) => {
 
    if (httpResponse.status === 200) { // HTTP Status Code 200 = Ok
      this.cocktails = httpResponse.body.drinks;
    } else {
      this.APIErrorMessage = `Fehler bei Zugriff auf Web-API: ${httpResponse.statusText} (${httpResponse.status})`;
      this.APIError = true;
      console.log(this.APIErrorMessage);
    }
    this.showSkeleton = false;
  }

  private verarbeiteHttpFehler = (fehler: HttpErrorResponse) => {
 
    this.APIErrorMessage = "Fehler bei Abfrage Web-API von Server: " + fehler.message;
    this.APIError = true;
    console.log(this.APIErrorMessage);
    this.showSkeleton = false;
  }
 
  doRefresh(event) {
    this.loadData();
 
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  onClear(ev) { 
    this.searchTerm='';
    this.loadData();
  }

  addCocktail(
              idDrink,
              strDrinkThumb,
              strDrink,
              strInstructionsDE,
              strMeasure1,
              strMeasure2,
              strMeasure3,
              strMeasure4,
              strMeasure5,
              strMeasure6,
              strMeasure7,
              strMeasure8,
              strMeasure9,
              strMeasure10,
              strMeasure11,
              strMeasure12,
              strMeasure13,
              strMeasure14,
              strMeasure15,
              strIngredient1,
              strIngredient2,
              strIngredient3,
              strIngredient4,
              strIngredient5,
              strIngredient6,
              strIngredient7,
              strIngredient8,
              strIngredient9,
              strIngredient10,
              strIngredient11,
              strIngredient12,
              strIngredient13,
              strIngredient14,
              strIngredient15
    ){
    this.speicherService.addCocktail(
              this.id, 
              idDrink,
              strDrinkThumb,
              strDrink,
              strInstructionsDE,
              strMeasure1,
              strMeasure2,
              strMeasure3,
              strMeasure4,
              strMeasure5,
              strMeasure6,
              strMeasure7,
              strMeasure8,
              strMeasure9,
              strMeasure10,
              strMeasure11,
              strMeasure12,
              strMeasure13,
              strMeasure14,
              strMeasure15,
              strIngredient1,
              strIngredient2,
              strIngredient3,
              strIngredient4,
              strIngredient5,
              strIngredient6,
              strIngredient7,
              strIngredient8,
              strIngredient9,
              strIngredient10,
              strIngredient11,
              strIngredient12,
              strIngredient13,
              strIngredient14,
              strIngredient15
      );
  }

  ionViewWillEnter(){
    this.id = this.idService.getPartyID();
  }

}
