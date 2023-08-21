import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//import { AngularFireModule } from '@angular/fire';
//import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerStatsPageComponent } from './player-stats-page/player-stats-page.component';
import { StandingsPageComponent } from './standings-page/standings-page.component';
import { TeamRosterPageComponent } from './team-roster-page/team-roster-page.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { PlayerPageComponent } from './player-page/player-page.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { environment } from '../environments/environment';
import { HomePageComponent } from './home-page/home-page.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerStatsPageComponent,
    StandingsPageComponent,
    TeamRosterPageComponent,
    SchedulePageComponent,
    PlayerPageComponent,
    NavBarComponent,
    HomePageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    //AngularFireModule.initializeApp(environment.firebase),
    //AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
