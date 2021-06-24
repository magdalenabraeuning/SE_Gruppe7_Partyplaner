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
  id:string;
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
  partyData: any = [];
  allIDs: any = [];

  constructor(
    public afAuth: AngularFireAuth,
    public afFirestore: AngularFirestore,
    private alertCtrl: AlertController
  ) {
    //this.userProfileCollection = afFirestore.collection<any>('3');
    //console.log(this.userProfileCollection);
  }

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
    console.log("start getPartys: "+this.afFirestore.collection("User").doc<PartyForUser>(id).valueChanges());
    return this.afFirestore.collection("User").doc<PartyForUser>(id).valueChanges();
  }
  async getDocuments(id) {
    console.log("start getDocuments")

    const secondFunction = async () => {
      const result = await this.firstFunction(id);
      console.log("end getDocuments")
    }
    secondFunction();
  }

  async firstFunction(id){
    await console.log("start firstFunction" )
    await this.afFirestore.collection("User").doc<PartyForUser>(id).valueChanges().subscribe(async res => {

      await console.log("getDocuments PartyIDs" + res.Partys);
      this.partyArr = await res.Partys;
      await console.log("Eine PartyID" + this.partyArr[0]);

    })
    await console.log("end firstFunction" )
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

  signOut() {
    this.afAuth.signOut().then(() => {
      location.reload();
    });
  }
  myEventList: any;

  async addParty() {
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
              //cry: firebase.firestore.FieldValue.toString(),
              // documentID: randomID

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
    }).then(a => a.present());
  }
  ionViewDidEnter() { //this.fetch(); 
  console.log("ION VIEW DID ENTER")}

  pruefeUserVorhanden(userID) {
    let userVorhanden = false;
    for (let j = 0; j < this.allIDs.length; j++) {
      if (this.allIDs[j].id == userID) {
        userVorhanden = true;
      }
    }
    console.log("DAS IST MEIN USER?: "+userVorhanden)
    return userVorhanden;
  }

  async fetch() {
    console.log("start")
    let userID = (await this.afAuth.currentUser.then((user) => { return user.uid; }));
    console.log("end")
    console.log("cry" + userID)
    //await this.getDocuments(userID);
    /* this.afFirestore.collection("User").doc<PartyForUser>(userID).valueChanges().subscribe(res => {
 
       console.log("getDocuments PartyIDs"+res);
       this.partyArr = res.Partys;
       console.log("Eine PartyID"+this.partyArr[0]);
 
     });*/

     const secondFunction = async () => {
       console.log("secondFunction");
      const result = await this.getDocuments(userID);
      await console.log("Partyarray: " + this.partyArr);

    for (let i = 0; i < this.partyArr.length; i++) {
      console.log("Hiiiiiier IDs" + this.partyArr[i])
      this.getPartyDocuments(this.partyArr[i], i);
    }

    console.log("biiiitteee" + this.partyData[0]);
    }

    secondFunction();
    
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
    console.log("DELETE START")
    this.afFirestore.collection("Partys").doc(id).delete();
    let userID = (await this.afAuth.currentUser.then((user) => { return user.uid; }));
    this.afFirestore.collection("User").doc(userID).update({
      Partys: firebase.firestore.FieldValue.arrayRemove(id)
    });
    console.log("DELETE END")
  }

}

