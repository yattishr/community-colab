import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';

import { AlertController, Platform, LoadingController  } from '@ionic/angular';
import { Router } from '@angular/router';

// import Email validator page
import { EmailValidator } from '../../validators/email';

// Firebase imports
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFirestore } from 'angularfire2/firestore';

// import LoginPage and HomePage
import { HomePage } from '../home/home.page';
import { LoginPage } from '../login/login.page';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  public resetPwdForm : FormGroup;

  constructor(
      public formBuilder: FormBuilder, 
      public loadingCtrl: LoadingController, 
      public afAuth: AngularFireAuth, 
      public alertCtrl: AlertController, 
      public firestore: AngularFirestore,
      private router: Router) 
    { 
      this.resetPwdForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])]
    });
    }

  ngOnInit() {
  }


  resetUserPwd() {
    this.afAuth.auth.sendPasswordResetEmail(this.resetPwdForm.value.email).then((user) => {
      this.showInfoAlert("Password Reset", "Password Information", "We just sent a link to reset your password to your email.");
    }, (error) => {
      this.presentLoading('Resetting password, please wait...');
      this.showInfoAlert("Password Reset", "Password Information", error.message);
    });
  }
  

  loginUser() {      
    this.router.navigateByUrl('/login')
}  

  // show Alerts once we have submitted the form
  async showInfoAlert(txtHeader, txtsubHeader, txtMesg) {  
    const alert = await this.alertCtrl.create({  
      header: txtHeader,  
      subHeader: txtsubHeader,  
      message: txtMesg,  
      buttons: ['OK']  
    });  
    await alert.present();  
    const result = await alert.onDidDismiss();  
  }

  // present Loading message
  async presentLoading(loadingmsg) {
    const loading = await this.loadingCtrl.create({
      message: loadingmsg,
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }   

}
