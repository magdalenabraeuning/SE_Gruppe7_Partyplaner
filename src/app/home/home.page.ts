import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //Konstruktor zum Initialisieren der Services
  constructor(
    private navCtrl: NavController,
    public afAuth: AngularFireAuth,
  ) { }

  //Weiterleitung zur Partys-Page
  navigateToHome(){
    let navigationTarget = `/partys`;
      this.navCtrl.navigateForward(navigationTarget);
  }

  //User ausloggen
  signOut() {
    this.afAuth.signOut();
  }
}