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
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public signupForm: FormGroup;

  constructor(public formBuilder: FormBuilder, 
    public loadingCtrl: LoadingController, public afAuth: AngularFireAuth, 
    public alertCtrl: AlertController, public firestore: AngularFirestore, public router: Router) { 
    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      retype: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }


  ngOnInit() {
  }


  signupUser() {
    if (this.signupForm.value.password == this.signupForm.value.retype) {
      this.afAuth.auth.createUserWithEmailAndPassword(this.signupForm.value.email, this.signupForm.value.password)
        .then(() => {
          let userId = this.afAuth.auth.currentUser.uid;
          let userDoc = this.firestore.doc<any>('users/' + userId);
          userDoc.set({
            firstName: this.signupForm.value.firstName,
            lastName: this.signupForm.value.lastName,
            email: this.signupForm.value.email
          });
          // this.navCtrl.goRoot(HomePage);
          // this.navCtrl.navigateRoot('HomePage');          
          this.router.navigateByUrl('/home');
        }, (error) => {
          this.presentLoading('Signing up please wait...');
          this.showInfoAlert("Sign-up", "Password Information", error.message);
        });
        this.presentLoading('Signing up wait...');
    } else {
      let alert = this.alertCtrl.create({
        message: "The passwords do not match.",
        buttons: [{ text: "Ok", role: 'cancel' }]
      });
      this.showInfoAlert("Sign-up", "Password Information", "The passwords do not match.");
    }
  }  

  loginUser() {      
    this.router.navigateByUrl('/login')
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

async showAlert() {  
  const alert = await this.alertCtrl.create({  
    header: 'Thank you',  
    subHeader: 'Donation Added',  
    message: 'Thank you for your donation!',  
    buttons: ['OK']  
  });  
  await alert.present();  
  const result = await alert.onDidDismiss();  
  console.log(result);  
}
  
  
  
}
