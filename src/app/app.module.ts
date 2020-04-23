import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Geo-location import
import { Geolocation } from '@ionic-native/geolocation/ngx';

// Firebase imports
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

// import routing pages
// import { LoginPage } from './login/login.page';
// import { ResetPasswordPage } from './reset-password/reset-password.page';
// import { SignupPage } from './signup/signup.page';
// import { HomePage } from './home/home.page';

// import module pages
// import { HomePageModule } from './home/home.module';


export const firebaseConfig = {
  apiKey: "AIzaSyDwljGz8ZCnkeD4fZ1LvTJbE703Oo_YSYk",
  authDomain: "community-a5320.firebaseapp.com",
  databaseURL: "https://community-a5320.firebaseio.com",
  projectId: "community-a5320",
  storageBucket: "community-a5320.appspot.com",
  messagingSenderId: "656847969958",
  appId: "1:656847969958:web:54429f99c2614356ea5e67"
};


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig), 
    AngularFireAuthModule, 
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [Geolocation,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
