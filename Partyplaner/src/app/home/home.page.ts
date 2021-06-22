import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
// auskommentiert für CI 
//import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

 

  constructor(public afAuth: AngularFireAuth) {}

  signOut(){
    this.afAuth.signOut().then(() => {
      location.reload();
    });


  }

}
