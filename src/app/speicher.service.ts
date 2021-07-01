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

  constructor(public einTeilnehmer) {
    this.Teilnehmer = einTeilnehmer;
  }
  title: string;
  description: string;
  address: string;
  date: string;
  time: string;

  Essen: [];

  Teilnehmer: [];

  isDone: boolean;
  createdAt: number;
  id: string;
  partymodus: boolean;

  /**
   * Titel
   * Beschreibung
   * Adresse
   * Datum
   * Uhrzeit
   * 
   * Status
   * createdAt
   * id
   */
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
            console.log("Hiiiiiier IDs" + partyArr[i])
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

      console.log("getDocuments PartyIDs" + res.Partys)
      this.partyArr = res.Partys;
      this.partyArrObsrv.next(res.Partys);
      console.log("Eine PartyID" + this.partyArr[0]);

    });
  }

  getPartyData(id) {
    return this.afFirestore.collection("Partys").doc<AllPartyData>(id).valueChanges();
  }
  getPartyDocuments(id, i) {

    this.getPartyData(id).subscribe(res => {

      this.partyData[i] = { title: res.title, description: res.description, address: res.address, date: res.date, time: res.time, createdAt: res.createdAt, isDone: res.isDone, id: res.id, partymodus: res.partymodus };
      console.log("Partydaten idddddddd 1" + this.partyData[i].createdAt);
      console.log("Partydaten idddddddd 2" + this.partyData[i].title);
      console.log("Partydaten idddddddd 3" + this.partyData[i].description);
      console.log("Partydaten idddddddd 4" + this.partyData[i].isDone);

    })
  }


  async addParty(res) {
    try {
      console.log("START speicherService addParty");
      this.afAuth.currentUser.then((user) => {
        let userID = "0";
        try {
          userID = user.uid;
        } catch (e) {
          console.log(e);
          return;
        }

        console.log("speicherService res: " + res);
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
          //Sammlung Einkaufsliste, ...

        }).then((r) => {
          this.afFirestore.collection("Partys").doc(r.id).update({
            id: r.id
          }).then(() => {
            this.getAllUserData().then(() => {
              this.userIDArrObsrv.pipe(take(1)).subscribe(() => {

                let userVorhanden = false;
                for (let i = 0; i < this.allIDs.length; i++) {
                  console.log("Hiiiiiier IDs" + this.allIDs[i]);
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

      console.log("speicherService UserIDs alle" + res);

      this.allIDs = res.map(e => {
        return {
          id: e.payload.doc.id
        };
      });
      this.userIDArrObsrv.next(res);
      console.log("Eine UserID" + this.allIDs[0].id);

    })
  }

  pruefeUserVorhanden(pruefeID, userID) {
    let userVorhanden = false;
    if (pruefeID == userID) {
      userVorhanden = true;
    }
    console.log("DAS IST MEIN USER?: " + userVorhanden)
    return userVorhanden;
  }

  async delete(id): Promise<any> {
    console.log("DELETE START")


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

  partymodusStarten(partyID, status) {
    this.afFirestore.collection("Partys").doc(partyID).update({
      partymodus: !status
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
      console.log("Teilnehmer: " + party.Teilnehmer);
      let partyTeilnehmer = new AllPartyData(party.Teilnehmer);
      ergebnisArray.push(partyTeilnehmer);
    });

    //console.log("Teilnehmer: "+(await teilnehmerPromise));
    return ergebnisArray;
  }

  addTeilnehmer(partyID, userMail) {

    //let emails = this.getAllEmails();
    //this.afAuth.user.forEach((user) => console.log("EMAIL: "+user.displayName))



    this.afFirestore.collection("Partys").doc(partyID).update({
      Teilnehmer: firebase.firestore.FieldValue.arrayUnion(userMail)
    });
  }

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
  }

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


}