import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private navCtrl: NavController,
    public afAuth: AngularFireAuth,
  ) { }

  navigateToHome(){
    let navigationTarget = `/partys`;
      this.navCtrl.navigateForward(navigationTarget);
  }
  signOut() {
    this.afAuth.signOut();
  }
}