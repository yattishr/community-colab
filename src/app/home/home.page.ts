import { Component, ViewChild, NgModule } from '@angular/core';
import { AlertController, Platform, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';

// Firebase imports
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFirestore } from 'angularfire2/firestore';

// import routing
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  taskList = [];
  latVal: any; // store longitude & latitude into variable
  coordinates = [];

  public todo : FormGroup;


  constructor(
    public formBuilder: FormBuilder, 
    public loadingCtrl: LoadingController, public afAuth: AngularFireAuth, 
    public alertCtrl: AlertController, public firestore: AngularFirestore,
    public platform: Platform, public geolocation: Geolocation, 
    private router: Router, public toastController: ToastController
    ) {
    this.todo = this.formBuilder.group({
      inputType: ['', Validators.required],
      inputQty: '00',
      inputDescr: [''],
      inputMobile: ['', Validators.required],
      inputEmail: [''],
      inputAddInfo: [''],
      inputLocation: 'True'
    });

    this.platform.ready().then((readySource) => {
      console.log('Platform ready, checking device location...');
      
      // Platform now ready, execute any required native code
      // this.checkLocation();

      // display toast controller
      this.presentToast("Welcome to community collaboration!");
        
    });

  }
  
  // log our Donations into the database
  logForm() {
    console.log(this.todo.value);
    console.log(this.todo.value['inputType']);
    
    if (this.todo.value['inputType'].length > 0) {
      let task = this.todo.value;
      this.taskList.push(task);
      console.log("Logging task to console...");
      console.log(task);

      // check if user selected "Use Location"
      this.checkLocation();      
    }
    this.showAlert(); // show info alert to user
    // this.clearForm(); // this piece of code doesn't work. need to re-look.
  }


  logout() {
    return this.afAuth.auth.signOut().then(authData => {
        this.router.navigateByUrl('/login');
        this.presentToast("You have successfully logged out.");
    });
  }   

  checkLocation() {
    if (this.todo.value['inputLocation']) {
      console.log("Use my current location turned on...");
      this.getLocation();                  
    } else {
      console.log("Use my current location turned off...");
    }
  }

  getLocation() {
    this.geolocation.getCurrentPosition(
      {maximumAge: 1000, timeout: 5000,
       enableHighAccuracy: true }
      ).then((resp) => {
            console.log('Getting co-ordinates...', resp.coords['latitude']);    
            console.log('Displaying geo-location information...', resp);   
            this.taskList.push(resp);
            console.log('Displaying all gathered information...', this.taskList);
            },er=>{
              alert('Cannot retrieve Location')
            }).catch((error) => {
            alert('Error getting location - ' + JSON.stringify(error))
            });
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

  // show Alerts once we have submitted the form
  async showAlert() {  
    const alert = await this.alertCtrl.create({  
      header: 'Thank you',  
      subHeader: 'Donation Added',  
      message: 'Thank you for your donation!',  
      buttons: ['OK']  
    });  
    await alert.present();  
    const result = await alert.onDidDismiss();  
  }

  // display toast controller
  async presentToast(toastMessage) {
    const toast = await this.toastController.create({
      message: toastMessage,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }


  // clear the form after submission. still need to rework this piece of code
  clearForm() {
    console.log("Clearing form...");
    this.todo.value['inputType'] = "";
    this.todo.value['inputQty'] = "00";
    this.todo.value['inputDescr'] = "";
    this.todo.value['inputMobile'] = "";
    this.todo.value['inputEmail'] = "";
    this.todo.value['inputAddInfo'] = "";    
  }

}

