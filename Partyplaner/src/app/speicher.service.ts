import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import firebase from 'firebase/app';

export interface PartyForUser {
  Partys: [];
}

export interface AllPartyData {
  title: string;
  description: string;
  address: string;
  date: string;
  time: string;

  isDone: boolean;
  createdAt: number;
  id: string;

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


  constructor(
    public afAuth: AngularFireAuth,
    public afFirestore: AngularFirestore
  ) { }


  async loadAllData(): Promise<any[]> {
    this.afAuth.currentUser.then((user) => {
      let userID = user.uid;
      this.getDocuments(userID);

      this.partyArrObsrv.pipe(take(1)).subscribe((partyArr) => {
        for (let i = 0; i < partyArr.length; i++) {
          console.log("Hiiiiiier IDs" + partyArr[i])
          this.getPartyDocuments(partyArr[i], i);
        }
      });

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

      this.partyData[i] = { title: res.title, description: res.description, address: res.address, date: res.date, time: res.time, createdAt: res.createdAt, isDone: res.isDone, id: res.id };
      console.log("Partydaten idddddddd 1" + this.partyData[i].createdAt);
      console.log("Partydaten idddddddd 2" + this.partyData[i].title);
      console.log("Partydaten idddddddd 3" + this.partyData[i].description);
      console.log("Partydaten idddddddd 4" + this.partyData[i].isDone);

    })
  }


  async addParty(res) {
    console.log("START speicherService addParty");
    this.afAuth.currentUser.then((user) => {
      let userID = user.uid;

      console.log("speicherService res: " + res);
      this.afFirestore.collection("Partys").add({

        title: res.title,
        description: res.description,
        address: res.address,
        date: res.date,
        time: res.time,

        createdAt: Date.now(),
        isDone: false,
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
    })


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

async delete(id):Promise<any>{
  console.log("DELETE START")
  
  
    this.afAuth.currentUser.then((x) => {
      let userID = x.uid;
      
      this.afFirestore.collection("User").doc(userID).update({
        Partys: firebase.firestore.FieldValue.arrayRemove(id)
      });
      this.afFirestore.collection("Partys").doc(id).delete();
      
    });
    
    
    
}


update(id, status) {
  this.afFirestore.collection("Partys").doc(id).update({
    isDone: !status
  });
}


}
