import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdService {

  //Variable in welcher die entsprechende PartyID zentral gespeichert wird
  private partyID:"";

  constructor() { }

  //Speichern der Party-ID in der Variable
  setPartyID(id){
    this.partyID = id;
  }

  //Ausgeben der Party-ID
  getPartyID(){
    return this.partyID;
  }
}
