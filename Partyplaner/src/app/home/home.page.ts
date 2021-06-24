import { Subject } from 'rxjs';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { PartymodusPage } from '../partymodus/partymodus.page';
import { take } from 'rxjs/operators';
import { SpeicherService } from '../speicher.service';

export interface PartyForUser {
  Partys: [];
}

export interface AllPartyData {
  createdAt: number;
  desc: string;
  isDone: boolean;
  title: string;
  id: string;
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: any = [];
  userProfileCollection;
  partyArr: any[];
  partyData: any = [];
  allIDs: any = [];
  partyArrObsrv: Subject<any> = new Subject<any>();


  constructor(
    public afAuth: AngularFireAuth,
    public afFirestore: AngularFirestore,
    private alertCtrl: AlertController,
    private speicherService: SpeicherService,
  ) { }
  /*
    getAllUserData() {
      this.afFirestore.collection('User').snapshotChanges().subscribe(data => {
  
        this.allIDs = data.map(e => {
          return {
            id: e.payload.doc.id
          };
        })
      });
    }
  
    getPartys(id) {
      return this.afFirestore.collection("User").doc<PartyForUser>(id).valueChanges();
    }
    async getDocuments(id) {
  
      this.getPartys(id).subscribe(res => {
  
        console.log("getDocuments PartyIDs" + res)
        this.partyArr = res.Partys;
        this.partyArrObsrv.next(res.Partys);
        console.log("Eine PartyID" + this.partyArr[0]);
  
      })
    }
  
    getPartyData(id) {
      return this.afFirestore.collection("Partys").doc<AllPartyData>(id).valueChanges();
    }
  
    getPartyDocuments(id, i) {
  
      this.getPartyData(id).subscribe(res => {
  
        //console.log("Partydaten alle an Stelle" + i + " = " + res.createdAt)
  
        this.partyData[i] = { createdAt: res.createdAt, title: res.title, desc: res.desc, isDone: res.isDone, id: res.id};
        console.log("Partydaten idddddddd 1" + this.partyData[i].createdAt);
        console.log("Partydaten idddddddd 2" + this.partyData[i].title);
        console.log("Partydaten idddddddd 3" + this.partyData[i].desc);
        console.log("Partydaten idddddddd 4" + this.partyData[i].isDone);
  
      })
    }
  */
  signOut() {
    this.afAuth.signOut().then(() => {
      location.reload();
    });
  }
  myEventList: any;

  async addParty() {

    this.alertCtrl.create({
      message: "Party erstellen",
      inputs: [
        { type: 'text', name: 'title' },
        { type: 'textarea', name: 'desc' }
      ],
      buttons: [
        {
          text: 'Add',
          handler: (res) => {
            console.log(res);
            this.speicherService.addParty(res);
          }
        }, {
          text: 'Cancel'
        }
      ]
    }).then(a => a.present());
  }




  /*
  let userID = (await this.afAuth.currentUser.then((user) => { return user.uid; }));

  this.alertCtrl.create({
    message: "Party erstellen",
    inputs: [
      { type: 'text', name: 'title' },
      { type: 'textarea', name: 'desc' }
    ],
    buttons: [
      {
        text: 'Add',
        handler: (res) => {
          console.log(res);
          this.afFirestore.collection("Partys").add({

            title: res.title,
            desc: res.desc,
            createdAt: Date.now(),
            isDone: false,
            //Sammlung Einkaufsliste, ...

          }).then((r) => {
            this.afFirestore.collection("Partys").doc(r.id).update({
              id: r.id
            });

            this.getAllUserData();
            console.log(this.allIDs);
            if (this.pruefeUserVorhanden(userID)) {
              this.afFirestore.collection("User").doc(userID).update({

                Partys: firebase.firestore.FieldValue.arrayUnion(r.id)
              });
            }else{
              this.afFirestore.collection("User").doc(userID).set({
                Partys: firebase.firestore.FieldValue.arrayUnion(r.id)
              })

            }

          })
        }
      }, {
        text: 'Cancel'
      }

    ]
  }).then(a => a.present());*/

  ionViewDidEnter() { //this.fetch();
    console.log("ION VIEW DID ENTER")
  }

  pruefeUserVorhanden(userID) {
    let userVorhanden = false;
    for (let j = 0; j < this.allIDs.length; j++) {
      if (this.allIDs[j].id == userID) {
        userVorhanden = true;
      }
    }
    console.log("DAS IST MEIN USER?: " + userVorhanden)
    return userVorhanden;
  }

  async fetch() {
    this.partyData = await this.speicherService.loadAllData();

    /*
        this.afAuth.currentUser.then((user) => {
          let userID = user.uid;
          this.getDocuments(userID);
    
          this.partyArrObsrv.pipe(take(1)).subscribe( (partyArr)=>{
            for (let i = 0; i < partyArr.length; i++) {
              console.log("Hiiiiiier IDs" + partyArr[i])
              this.getPartyDocuments(partyArr[i], i);
            }
          });
    
        });*/
  }

  update(id, status) {
    this.afFirestore.collection("Partys").doc(id).update({
      isDone: !status
    });
  }

  async delete(id) {
    console.log("DELETE START")
    this.afFirestore.collection("Partys").doc(id).delete();
    let userID = (await this.afAuth.currentUser.then((user) => { return user.uid; }));
    this.afFirestore.collection("User").doc(userID).update({
      Partys: firebase.firestore.FieldValue.arrayRemove(id)
    });
    console.log("DELETE END")
  }

}

