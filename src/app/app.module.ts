import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';
import { OnlineStatusModule } from 'ngx-online-status';
import { FormsModule } from '@angular/forms';
import { IonRouterOutlet } from '@ionic/angular';
// import { GoogleMapComponent } from './components/google-map/google-map.component';
import { SharedModuleModule } from './modules/shared-module/shared-module.module';
import { NgCalendarModule } from 'ionic2-calendar';
import { DatePipe } from '@angular/common';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HttpClientModule, provideHttpClient } from  '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,IonicModule.forRoot(),
  AppRoutingModule,
  AngularFireAuthModule,
  AngularFireStorageModule,
  FormsModule,
  AngularFireModule.initializeApp(environment.firebaseConfig),
  AngularFireDatabaseModule,
  OnlineStatusModule,
  SharedModuleModule,
  HttpClientModule,
  //AngularFirestoreModule.enablePersistence(),
  NgCalendarModule,
  
],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, DatePipe, provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule {}
