import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdService {

  partyID:"";
  //userID:"";

  constructor() { }

  setPartyID(id){
    this.partyID = id;
  }

  getPartyID(){
    return this.partyID;
  }
}
