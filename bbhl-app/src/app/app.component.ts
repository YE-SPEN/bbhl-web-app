import { Component } from '@angular/core';
//import { AngularFireAuth } from '@angular/fire/auth';
//import { auth } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bbhl-app';

  constructor(
    //public auth: AngularFireAuth,
  ) { }

  /*signinClicked(): void {
    this.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  signOutClicked(): void {
    this.auth.signOut();
  }
  */
}
