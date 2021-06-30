import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-cocktail',
  templateUrl: './cocktail.page.html',
  styleUrls: ['./cocktail.page.scss'],
})
export class CocktailPage implements OnInit {

  searchTerm = "";
  IngArr : any [];


  constructor(
    private httpClient: HttpClient
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

}
