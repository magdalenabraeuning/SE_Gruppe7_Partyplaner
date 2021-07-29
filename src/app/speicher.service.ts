import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import firebase from 'firebase/app';

//Interface, welches zum Speichern der Party-IDs eines Users verwendet wird
export interface PartyForUser {
  Partys: [];
}

//Klasse, welche alle Eigenschaften einer Party definiert
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

//Zentraler Service, welcher die Datenbankaufrufe verwaltet
export class SpeicherService {

  //Variablen
  partyArrObsrv: Subject<any> = new Subject<any>();
  partyArr: any[];
  partyData: any = [];
  allIDs: any[];
  userIDArrObsrv: Subject<any> = new Subject<any>();

  //Konstruktor zum Initialisieren der benötigten Services
  constructor(
    public afAuth: AngularFireAuth,
    public afFirestore: AngularFirestore
  ) { }

  //Methode zum Abrufen aller Party-Daten aus dem Speicher
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
        console.log("Fehler UserID SpeicherService: " + e);
      }
    });
    return this.partyData;
  }

  //Rückgabe des Pfades zur Stelle im Speicher, an der die Party-IDs des Users "userID" hinterlegt sind
  getPartys(userID) {
    return this.afFirestore.collection("User").doc<PartyForUser>(userID).valueChanges();
  }

  //Alle Party-IDs des Users "userID" werden aus dem Speicher gelesen
  async getDocuments(userID) {
    this.getPartys(userID).subscribe(res => {
      this.partyArr = res.Partys;
      this.partyArrObsrv.next(res.Partys);
    });
  }

  //Rückgabe des Pfades zur Stelle im Speicher, an der die Party-Daten der Party "partyID" hinterlegt sind
  getPartyData(partyID) {
    return this.afFirestore.collection("Partys").doc<AllPartyData>(partyID).valueChanges();
  }

  //Alle Party-Daten der Party "partyID" werden aus dem Speicher gelesen
  getPartyDocuments(partyID, i) {
    this.getPartyData(partyID).subscribe(res => {
      this.partyData[i] = { title: res.title, description: res.description, address: res.address, date: res.date, time: res.time, createdAt: res.createdAt, isDone: res.isDone, id: res.id, partymodus: res.partymodus };
    })
  }

  //Die neue Party "res" wird gespeichert
  async addParty(res) {
    //die UserID des angemeldeten Users wird abgefragt
    try {
      this.afAuth.currentUser.then((user) => {
        let userID = "0";
        try {
          userID = user.uid;
        } catch (e) {
          console.log(e);
          return;
        }

        //Die Party wird in der Collection "Partys" gespeichert
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

          //Die automatisch generierte Party-ID wird zusätzlich zur Party gespeichert (kann sonst nicht abgefragt werden)
          this.afFirestore.collection("Partys").doc(r.id).update({
            id: r.id
          }).then(() => {
            this.getAllUserData().then(() => {
              this.userIDArrObsrv.pipe(take(1)).subscribe(() => {

                //Es wird geprüft ob der angemeldete User bereits in der User-Collection hinterlegt ist
                let userVorhanden = false;
                for (let i = 0; i < this.allIDs.length; i++) {
                  if (this.pruefeUserVorhanden(this.allIDs[i].id, userID)) {
                    userVorhanden = true;
                  }
                }

                //Wenn der User bereits hinterlegt ist (er bereits Partys erstellt hat), wird die Liste, in welcher alle Party-IDs 
                //der Partys des Users gespeichert sind, um die neue Party erweitert 
                if (userVorhanden) {
                  console.log("User vorhanden")
                  this.afFirestore.collection("User").doc(userID).update({
                    Partys: firebase.firestore.FieldValue.arrayUnion(r.id)
                  });
                } else {
                  //Wenn der User noch keine Party erstellt hat, wird ein neues Array angelegt, in welchem die neue Party-ID gespeichert wird
                  console.log("User nicht vorhanden")
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
      console.log("Fehler beim Speichern der Party (SpeicherService): " + e);
    }
  }

  //Rückgabe des Pfades zur Stelle im Speicher, an der alle User (die bereits Partys erstellt haben) gespeichert sind
  getUsers() {
    return this.afFirestore.collection('User').snapshotChanges();
  }

  //Alle User-IDs der User, welche bereits Partys erstellt haben, werden ausgelesen
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

  //Es werden zwei User-IDs auf Übereinstimmung geprüft
  pruefeUserVorhanden(pruefeID, userID) {
    let userVorhanden = false;
    if (pruefeID == userID) {
      userVorhanden = true;
    }
    return userVorhanden;
  }

  //Eine Party mit der ID "id" wird gelöscht
  async delete(id): Promise<any> {
    this.afAuth.currentUser.then((x) => {
      let userID = x.uid;
      this.afFirestore.collection("User").doc(userID).update({
        Partys: firebase.firestore.FieldValue.arrayRemove(id)
      });
    });
  }

  //Der Status (in Planung/Planung abgeschlossen) der Party "id" wird getauscht
  updateStatus(id, status) {
    this.afFirestore.collection("Partys").doc(id).update({
      isDone: !status
    });
  }

  //Die Daten der Party "id" werden aktualisiert
  updateParty(res, id) {
    this.afFirestore.collection("Partys").doc(id).update({
      title: res.title,
      description: res.description,
      address: res.address,
      date: res.date,
      time: res.time
    });
  }

  //Alle Teilnehmer der Party "partyID" werden ausgelesen
  async getTeilnehmer(partyID): Promise<AllPartyData[]> {
    const ergebnisArray: AllPartyData[] = [];
    this.getPartyData(partyID).forEach(async (party) => {
      let partyTeilnehmer = new AllPartyData(party.Teilnehmer);
      ergebnisArray.push(partyTeilnehmer);
    });
    return ergebnisArray;
  }

  //Ein neuer Teilnehmer "user" wird zur Party "partyID" hinzugefügt
  addTeilnehmer(partyID, user) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Teilnehmer: firebase.firestore.FieldValue.arrayUnion(user)
    });
  }

  //Der Teilnehmer "user" der Party "partyID" wird gelöscht
  removeTeilnehmer(partyID, user) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Teilnehmer: firebase.firestore.FieldValue.arrayRemove(user)
    });
  }

  //Das Item "essenArray" wird der Liste "Essen" der Party "partyID" hinzugefügt
  addEssen(partyID, essenArray) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Essen: firebase.firestore.FieldValue.arrayUnion(essenArray)
    });
  }

  //Das Item "essenArray" wird aus der Liste "Essen" der Party "partyID" gelöscht
  removeEssen(partyID, essenArray) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Essen: firebase.firestore.FieldValue.arrayRemove(essenArray)
    });
  }

  //Alle Einträge der Liste "Essen" der Party "partyID" werden zurückgegeben
  async getEssen(partyID): Promise<AllPartyData[]> {
    const ergebnisArray: AllPartyData[] = [];
    this.getPartyData(partyID).forEach(async (party) => {
      let partyEssen = new AllPartyData(party.Essen);
      ergebnisArray.push(partyEssen);
    });
    return ergebnisArray;
  }

  //Das Item "trinkenArray" wird der Liste "Trinken" der Party "partyID" hinzugefügt
  addTrinken(partyID, trinkenArray) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Trinken: firebase.firestore.FieldValue.arrayUnion(trinkenArray)
    });
  }

  //Das Item "trinkenArray" wird aus der Liste "Trinken" der Party "partyID" gelöscht
  removeTrinken(partyID, trinkenArray) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Trinken: firebase.firestore.FieldValue.arrayRemove(trinkenArray)
    });
  }

  //Alle Einträge der Liste "Trinken" der Party "partyID" werden zurückgegeben
  async getTrinken(partyID): Promise<AllPartyData[]> {
    const ergebnisArray: AllPartyData[] = [];
    this.getPartyData(partyID).forEach(async (party) => {
      let partyTrinken = new AllPartyData(party.Trinken);
      ergebnisArray.push(partyTrinken);
    });
    return ergebnisArray;
  }

  //Das Item "sonstigesArray" wird der Liste "Sonstiges" der Party "partyID" hinzugefügt
  addSonstiges(partyID, sonstigesArray) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Sonstiges: firebase.firestore.FieldValue.arrayUnion(sonstigesArray)
    });
  }

  //Das Item "sonstigesArray" wird aus der Liste "Sonstiges" der Party "partyID" gelöscht
  removeSonstiges(partyID, sonstigesArray) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Sonstiges: firebase.firestore.FieldValue.arrayRemove(sonstigesArray)
    });
  }

  //Alle Einträge der Liste "Sonstiges" der Party "partyID" werden zurückgegeben
  async getSonstiges(partyID): Promise<AllPartyData[]> {
    const ergebnisArray: AllPartyData[] = [];
    this.getPartyData(partyID).forEach(async (party) => {
      let partySonstiges = new AllPartyData(party.Sonstiges);
      ergebnisArray.push(partySonstiges);
    });
    return ergebnisArray;
  }

  //Ein neuer Cocktail wird mit den zugehörigen Informationen zur Party "partyID" hinzugefügt
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

  //Der Cocktail "cocktailID" wird von der Party "partyID" gelöscht
  removeCocktail(partyID, cocktailID) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      Cocktails: firebase.firestore.FieldValue.arrayRemove(cocktailID)
    });
  }

  //Alle gespeicherten Cocktails der Party "partyID" werden zurückgegeben
  async getCocktails(partyID): Promise<AllPartyData[]> {
    const ergebnisArray: AllPartyData[] = [];
    this.getPartyData(partyID).forEach(async (party) => {
      let partyCocktails = new AllPartyData(party.Cocktails);
      ergebnisArray.push(partyCocktails);
    });
    return ergebnisArray;
  }

  //Der aktuelle Status des Partymodus (aktiviert/deaktiviert) der Party "partyID" wird zurückgegeben
  async getPartymodusStatus(partyID){
    let partymodusStatus:Boolean;
    this.getPartyData(partyID).forEach((party) => {
      partymodusStatus = party.partymodus;
    });
    return partymodusStatus;
  }

  //Der Status des Partymodus (aktiviert/deaktiviert) der Party "partyID" wird umgekehrt
  async partymodusStarten(partyID, status) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      partymodus: !status
    });
  }
}