// import { Component, ViewChild, NgModule, OnInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
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

import * as firebase from 'firebase/app';
import 'firebase/firestore';

// import routing
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  taskList = [];
  public locationVal: any; // store longitude & latitude into variable
  coordinates = [];
  userId: any; // stores the user name of currently logged in user
  fireStoreList: any; // object used to write into Firestore
  geoLocationList: any; // object to store geo-locaation data
  currentUser: any;

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

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
          this.userId = user.uid;          
          // this.fireStoreTaskList = this.firestore.doc<any>('users/' + this.userId).collection('tasks').valueChanges();
          this.fireStoreList = this.firestore.doc<any>('users/' + this.userId).collection('tasks');
          this.geoLocationList = this.firestore.doc<any>('users/' + this.userId).collection('gelocation');
          this.currentUser = user.displayName; // grab the current users name
          console.log("Current user is: ", this.currentUser);
      }
    });
  }    
  
  
  // log our Donations into the database
  logForm() {
    console.log(this.todo.value);
    console.log(this.todo.value['inputType']);
    
    if (this.todo.value['inputType'].length > 0) {

      let task = this.todo.value;
      let id = this.firestore.createId();
      let created = firebase.firestore.FieldValue.serverTimestamp();

      // check if user selected "Use Location"
      // this.checkLocation();  

      // check if user selected "Use Location"
      if (this.todo.value['inputLocation']) {
        console.log("Use my current location turned on...");
        this.getLocation();                  
      } else {
        console.log("Use my current location turned off...");
      }      

      // push form object into list
      this.taskList.push(task);
      console.log("Logging task to console...");
      console.log(task);      

      // display location information
      console.log("Displaying geo-location data...", this.locationVal);
      

      // push data into fireStore db
      this.fireStoreList.doc(id).set({
        id: id,
        created: created,
        owner: this.currentUser,
        taskName: task
      });            

      
      if (this.locationVal != "undefined") {
        // push geo-location data into fireStore db
        this.geoLocationList.doc(id).set({
          id: id,
          created: created,
          owner: this.currentUser,
          geoPos: this.locationVal
        });    
      }
        

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
            this.locationVal = resp;
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

