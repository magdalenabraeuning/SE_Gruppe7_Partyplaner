import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import  firebase  from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { PartymodusPage } from '../partymodus/partymodus.page';


export interface PartyForUser{
  Partys:[];
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: any = [];
  meinePartys: any= [];
  userProfileCollection;
  partyArr : any [];

  constructor(
    public afAuth: AngularFireAuth,
    public afFirestore: AngularFirestore,
    private alertCtrl: AlertController
  ) {
    this.userProfileCollection = afFirestore.collection<any>('3');
    console.log(this.userProfileCollection);
  }


  getP(){
    return this.afFirestore.collection("User").doc<PartyForUser>("userID").valueChanges();
  }
  getDocuments()
  {
    this.getP().subscribe( res => {
      
      console.log(res)
      this.partyArr = res.Partys;
      console.log(this.partyArr[0]);
      
    })
  }

  signOut() {
    this.afAuth.signOut().then(() => {
      location.reload();
    });
  }
  myEventList:any;

  async addParty() {
    let userID = (await this.afAuth.currentUser.then((user)=>{return user.uid;}));
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
              
            }).then((r)=>{
              meineID = r.id;

              this.afFirestore.collection("User").doc(userID).update({
              
                Partys: firebase.firestore.FieldValue.arrayUnion(meineID)
              });
              console.log("ID"+meineID);
            })
            

            
          }
        }, {
          text: 'Cancel'
        }

      ]
    }).then(a => a.present());
  }
  ionViewDidEnter() { this.fetch(); }

  getPartys(id){
    return this.afFirestore.collection('User').doc<PartyForUser>(id).valueChanges();
  }

  async fetch() {

    let userID = (await this.afAuth.currentUser.then((user)=>{return user.uid;}));
    this.getDocuments();
  
    
    //this.getPartys(userID).subscribe(data => {this.meinePartys = data});

   // this.afFirestore.collection('Partys').doc<PartyForUser>(userID).snapshotChanges().subscribe(data => {

     // this.meinePartys = data.payload.data()['Partys']
     // });
      //console.log(this.meinePartys);

  
    
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
    });
  }

  update(id, status) {
    this.afFirestore.collection("Partys").doc(id).update({
      isDone:!status
    });
  }

  async delete(id){
    this.afFirestore.collection("Partys").doc(id).delete();
    let userID = (await this.afAuth.currentUser.then((user)=>{return user.uid;}));
    this.afFirestore.collection("User").doc(userID).update({
      Partys: firebase.firestore.FieldValue.arrayRemove(id)
    });
  }

}

