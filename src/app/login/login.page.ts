import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';

import { AlertController, Platform, LoadingController  } from '@ionic/angular';
import { Router } from '@angular/router';

// import Email validator page
import { EmailValidator } from '../../validators/email';

// Firebase imports
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';


// import LoginPage and HomePage
import { HomePage } from '../home/home.page';
import { ResetPasswordPage } from '../reset-password/reset-password.page';
import { SignupPage } from '../signup/signup.page';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  public loginForm: FormGroup;

  constructor(public formBuilder: FormBuilder, 
              public loadingCtrl: LoadingController, 
              public afAuth: AngularFireAuth, 
              public alertCtrl: AlertController, 
              public firestore: AngularFirestore, 
              private router: Router) {
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
   }

  ngOnInit() {
  }

  loginUser() {
    this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.value['email'], this.loginForm.value['password']).then(() => {
      this.router.navigateByUrl('/home')
    }, (error) => {
      this.presentLoading('Logging in please wait...');
      this.showInfoAlert("Log in", "Password Information", error.message);
    });
    this.presentLoading('Logging in please wait...');
  }  


  resetPwd() {      
      this.router.navigateByUrl('/reset-password')
  }

  createAccount() {
    this.router.navigateByUrl('/signup')
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
    console.log(result);  
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
