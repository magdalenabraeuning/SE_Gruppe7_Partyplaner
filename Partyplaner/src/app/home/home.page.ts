import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

 

  constructor(public afAuth: AngularFireAuth) {}

  signOut(){
    console.log("jnjdnfs"+this.afAuth.currentUser);
    //this.afAuth.signOut().then(() => {
      //location.reload();
    //});

  }

}
