import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { PartymodusPage } from '../partymodus/partymodus.page';


export interface PartyForUser {
  Partys: [];
}

export interface AllPartyData {
  createdAt: number;
  desc: string;
  isDone: boolean;
  title: string;
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: any = [];
  //meinePartys: any= [];
  userProfileCollection;
  partyArr: any[];
  partyData: any[];

  constructor(
    public afAuth: AngularFireAuth,
    public afFirestore: AngularFirestore,
    private alertCtrl: AlertController
  ) {
    //this.userProfileCollection = afFirestore.collection<any>('3');
    //console.log(this.userProfileCollection);
  }


  getPartys(id) {
    return this.afFirestore.collection("User").doc<PartyForUser>(id).valueChanges();
  }
  getDocuments(id) {
    this.getPartys(id).subscribe(res => {

      console.log("getDocuments PartyIDs"+res)
      this.partyArr = res.Partys;
      console.log("Eine PartyID"+this.partyArr[0]);

    })
  }

  getPartyData(id) {
    return this.afFirestore.collection("Partys").doc<AllPartyData>(id).valueChanges();
  }

  getPartyDocuments(id) {
    this.getPartyData(id).subscribe(res => {

      console.log("Partydaten alle"+res)
      
      this.partyData[id] = [res.createdAt, res.isDone, res.desc, res.title];
      console.log("Partydaten idddddddd"+this.partyData[id]);

    })
  }

  signOut() {
    this.afAuth.signOut().then(() => {
      location.reload();
    });
  }
  myEventList: any;

  async addParty() {
    let userID = (await this.afAuth.currentUser.then((user) => { return user.uid; }));
    //console.log(userID);

    //let randomID = this.afFirestore.createId();
    let meineID;


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
              //cry: firebase.firestore.FieldValue.toString(),
              // documentID: randomID

            }).then((r) => {
              meineID = r.id;

              this.afFirestore.collection("User").doc(userID).update({

                Partys: firebase.firestore.FieldValue.arrayUnion(meineID)
              });
              console.log("ID" + meineID);
            })



          }
        }, {
          text: 'Cancel'
        }

      ]
    }).then(a => a.present());
  }
  ionViewDidEnter() { this.fetch(); }


  async fetch() {

    let userID = (await this.afAuth.currentUser.then((user) => { return user.uid; }));
    this.getDocuments(userID);

    console.log("Partyarray: "+this.partyArr);

    for (let i = 0; i < this.partyArr.length; i++) {
      console.log("Hiiiiiier IDs"+this.partyArr[i])
      this.getPartyDocuments(this.partyArr[i]);
    }


    /*
    this.afFirestore.collection('Partys').snapshotChanges().subscribe(data => {

      this.tasks = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          Name: e.payload.doc.data()['title'],
          Age: e.payload.doc.data()['isDone'],
          Address: e.payload.doc.data()['desc'],
        };
      })
      console.log(this.tasks);
    });*/
  }

  update(id, status) {
    this.afFirestore.collection("Partys").doc(id).update({
      isDone: !status
    });
  }

  async delete(id) {
    this.afFirestore.collection("Partys").doc(id).delete();
    let userID = (await this.afAuth.currentUser.then((user) => { return user.uid; }));
    this.afFirestore.collection("User").doc(userID).update({
      Partys: firebase.firestore.FieldValue.arrayRemove(id)
    });
  }

}

