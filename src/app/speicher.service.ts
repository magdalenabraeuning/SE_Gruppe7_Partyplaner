import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import firebase from 'firebase/app';


export interface PartyForUser {
  Partys: [];
}

export class AllPartyData {

  constructor(public ausgabe) {
    this.AusgabeArray = ausgabe;
  }
  title: string;
  description: string;
  address: string;
  date: string;
  time: string;

  AusgabeArray: [];
  Essen: [];
  Trinken: [];
  Sonstiges: [];
  Teilnehmer: [];
  Cocktails: [];

  isDone: boolean;
  createdAt: number;
  id: string;
  partymodus: boolean;

}


@Injectable({
  providedIn: 'root'
})
export class SpeicherService {

  partyArrObsrv: Subject<any> = new Subject<any>();
  partyArr: any[];
  partyData: any = [];
  allIDs: any[];
  userIDArrObsrv: Subject<any> = new Subject<any>();
  //allEMails: any[];


  constructor(
    public afAuth: AngularFireAuth,
    public afFirestore: AngularFirestore
  ) { }


  async loadAllData(): Promise<any[]> {
    this.partyData = [];
    let userID = "0";

    this.afAuth.currentUser.then((user) => {
      try {
        userID = user.uid;
        this.getDocuments(userID);

        this.partyArrObsrv.pipe(take(1)).subscribe((partyArr) => {
          for (let i = 0; i < partyArr.length; i++) {
            this.getPartyDocuments(partyArr[i], i);
          }
        });
      } catch (e) {
        console.log("Fehler UID SpeicherService: " + e);
      }
    });
    return this.partyData;


  }


  getPartys(id) {
    return this.afFirestore.collection("User").doc<PartyForUser>(id).valueChanges();
  }
  async getDocuments(id) {

    this.getPartys(id).subscribe(res => {
      this.partyArr = res.Partys;
      this.partyArrObsrv.next(res.Partys);
    });
  }

  getPartyData(id) {
    return this.afFirestore.collection("Partys").doc<AllPartyData>(id).valueChanges();
  }
  getPartyDocuments(id, i) {
    this.getPartyData(id).subscribe(res => {
      this.partyData[i] = { title: res.title, description: res.description, address: res.address, date: res.date, time: res.time, createdAt: res.createdAt, isDone: res.isDone, id: res.id, partymodus: res.partymodus };
    })
  }


  async addParty(res) {
    try {
      this.afAuth.currentUser.then((user) => {
        let userID = "0";
        try {
          userID = user.uid;
        } catch (e) {
          console.log(e);
          return;
        }

        this.afFirestore.collection("Partys").add({

          title: res.title,
          description: res.description,
          address: res.address,
          date: res.date,
          time: res.time,

          Teilnehmer: [],

          createdAt: Date.now(),
          isDone: false,
          partymodus: false

        }).then((r) => {
          this.afFirestore.collection("Partys").doc(r.id).update({
            id: r.id
          }).then(() => {
            this.getAllUserData().then(() => {
              this.userIDArrObsrv.pipe(take(1)).subscribe(() => {

                let userVorhanden = false;
                for (let i = 0; i < this.allIDs.length; i++) {
                  if (this.pruefeUserVorhanden(this.allIDs[i].id, userID)) {
                    userVorhanden = true;
                  }
                }

                if (userVorhanden) {
                  console.log("USER SCHON VORHANDEN")
                  this.afFirestore.collection("User").doc(userID).update({
                    Partys: firebase.firestore.FieldValue.arrayUnion(r.id)
                  });
                } else {
                  console.log("USER NICHT VORHANDEN")
                  this.afFirestore.collection("User").doc(userID).set({
                    Partys: firebase.firestore.FieldValue.arrayUnion(r.id)
                  })
                }
              });
            })
          });

        });
      });

    } catch (e) {
      console.log("Fehler beim Laden (SpeicherService): " + e);
    }

  }



  getUsers() {
    return this.afFirestore.collection('User').snapshotChanges();
  }
  async getAllUserData() {

    await this.getUsers().subscribe(res => {
      this.allIDs = res.map(e => {
        return {
          id: e.payload.doc.id
        };
      });
      this.userIDArrObsrv.next(res);
    })
  }

  pruefeUserVorhanden(pruefeID, userID) {
    let userVorhanden = false;
    if (pruefeID == userID) {
      userVorhanden = true;
    }
    return userVorhanden;
  }

  async delete(id): Promise<any> {

    this.afAuth.currentUser.then((x) => {
      let userID = x.uid;

      this.afFirestore.collection("User").doc(userID).update({
        Partys: firebase.firestore.FieldValue.arrayRemove(id)
      });
      //this.afFirestore.collection("Partys").doc(id).delete();
    });
  }


  updateStatus(id, status) {
    this.afFirestore.collection("Partys").doc(id).update({
      isDone: !status
    });
  }

  updateParty(res, id) {
    this.afFirestore.collection("Partys").doc(id).update({
      title: res.title,
      description: res.description,
      address: res.address,
      date: res.date,
      time: res.time
    });
  }

  /*
    async getTeilnehmer(partyID):Promise<AllPartyData[]> {
      const teilnehmerPromise = new Promise<AllPartyData[]>((resolveCallback, rejectCallback) => {
        const ergebnisArray: AllPartyData[]=[];
        this.getPartyData(partyID).forEach((party)=> {
          console.log("Teilnehmer: "+party.Teilnehmer);
          let partyTeilnehmer = new AllPartyData(party.Teilnehmer);
          ergebnisArray.push(partyTeilnehmer);
        }).then(()=>{
          resolveCallback(ergebnisArray);
        });
      });
  
       //console.log("Teilnehmer: "+(await teilnehmerPromise));
      return teilnehmerPromise;
    }*/


  async getTeilnehmer(partyID): Promise<AllPartyData[]> {
    const ergebnisArray: AllPartyData[] = [];
    this.getPartyData(partyID).forEach(async (party) => {
      let partyTeilnehmer = new AllPartyData(party.Teilnehmer);
      ergebnisArray.push(partyTeilnehmer);
    });
    return ergebnisArray;
  }

  addTeilnehmer(partyID, userMail) {

    this.afFirestore.collection("Partys").doc(partyID).update({
      Teilnehmer: firebase.firestore.FieldValue.arrayUnion(userMail)
    });
  }
/*
  getAllEmails() {
    let allEMails: any[];
    this.getUsers().subscribe(res => {

      console.log("speicherService UserIDs alle" + res);

      allEMails = res.map(e => {
        return {
          id: e.payload.doc.id
        };
      });
      //this.userIDArrObsrv.next(res);
      console.log("Eine UserID" + allEMails[0].id);

    })
    return allEMails;
  }*/

  removeTeilnehmer(partyID, userMail) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Teilnehmer: firebase.firestore.FieldValue.arrayRemove(userMail)
    });
  }

  addEssen(partyID, essenArray) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Essen: firebase.firestore.FieldValue.arrayUnion(essenArray)
    });
  }

  removeEssen(partyID, essenArray) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Essen: firebase.firestore.FieldValue.arrayRemove(essenArray)
    });
  }

  async getEssen(partyID): Promise<AllPartyData[]> {
    const ergebnisArray: AllPartyData[] = [];
    this.getPartyData(partyID).forEach(async (party) => {
      let partyEssen = new AllPartyData(party.Essen);
      ergebnisArray.push(partyEssen);
    });
    return ergebnisArray;
  }

  addTrinken(partyID, trinkenArray) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Trinken: firebase.firestore.FieldValue.arrayUnion(trinkenArray)
    });
  }

  removeTrinken(partyID, trinkenArray) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Trinken: firebase.firestore.FieldValue.arrayRemove(trinkenArray)
    });
  }

  async getTrinken(partyID): Promise<AllPartyData[]> {
    const ergebnisArray: AllPartyData[] = [];
    this.getPartyData(partyID).forEach(async (party) => {
      let partyTrinken = new AllPartyData(party.Trinken);
      ergebnisArray.push(partyTrinken);
    });
    return ergebnisArray;
  }

  addSonstiges(partyID, sonstigesArray) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Sonstiges: firebase.firestore.FieldValue.arrayUnion(sonstigesArray)
    });
  }

  removeSonstiges(partyID, sonstigesArray) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Sonstiges: firebase.firestore.FieldValue.arrayRemove(sonstigesArray)
    });
  }

  async getSonstiges(partyID): Promise<AllPartyData[]> {
    const ergebnisArray: AllPartyData[] = [];
    this.getPartyData(partyID).forEach(async (party) => {
      let partySonstiges = new AllPartyData(party.Sonstiges);
      ergebnisArray.push(partySonstiges);
    });
    return ergebnisArray;
  }

  /*
  getUserID() {
    let userID;
    this.afAuth.currentUser.then((user) => {
      try {
        userID = user.uid;
      } catch (e) {
        console.log(e);
      }
    });
    return userID;
  }*/


  addCocktail(partyID,
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
              strIngredient15) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Cocktails: firebase.firestore.FieldValue.arrayUnion({
        idDrink: idDrink, 
        strDrinkThumb: strDrinkThumb,
        strDrink: strDrink,
        strInstructionsDE: strInstructionsDE,
        strMeasure1: strMeasure1,
        strMeasure2: strMeasure2,
        strMeasure3: strMeasure3,
        strMeasure4: strMeasure4,
        strMeasure5: strMeasure5,
        strMeasure6: strMeasure6,
        strMeasure7: strMeasure7,
        strMeasure8: strMeasure8,
        strMeasure9: strMeasure9,
        strMeasure10: strMeasure10,
        strMeasure11: strMeasure11,
        strMeasure12: strMeasure12,
        strMeasure13: strMeasure13,
        strMeasure14: strMeasure14,
        strMeasure15: strMeasure15,
        strIngredient1: strIngredient1,
        strIngredient2: strIngredient2,
        strIngredient3: strIngredient3,
        strIngredient4: strIngredient4,
        strIngredient5: strIngredient5,
        strIngredient6: strIngredient6,
        strIngredient7: strIngredient7,
        strIngredient8: strIngredient8,
        strIngredient9: strIngredient9,
        strIngredient10: strIngredient10,
        strIngredient11: strIngredient11,
        strIngredient12: strIngredient12,
        strIngredient13: strIngredient13,
        strIngredient14: strIngredient14,
        strIngredient15: strIngredient15
      })
    });
  }

  removeCocktail(partyID, cocktailID) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Cocktails: firebase.firestore.FieldValue.arrayRemove(cocktailID)
    });
  }

  async getCocktails(partyID): Promise<AllPartyData[]> {
    const ergebnisArray: AllPartyData[] = [];
    this.getPartyData(partyID).forEach(async (party) => {
      let partyCocktails = new AllPartyData(party.Cocktails);
      ergebnisArray.push(partyCocktails);
    });
    return ergebnisArray;
  }

  getPartymodusStatus(partyID){
    let partymodusStatus = false;
    this.getPartyData(partyID).forEach(async (party) => {
      partymodusStatus = party.partymodus;
    });
    return partymodusStatus;
  }

  partymodusStarten(partyID, status) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      partymodus: !status
    });
  }
}