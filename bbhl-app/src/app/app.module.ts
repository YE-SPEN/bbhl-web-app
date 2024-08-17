import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
//import { AngularFireModule } from '@angular/fire';
//import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerStatsPageComponent } from './user/player-stats-page/player-stats-page.component';
import { StandingsPageComponent } from './user/standings-page/standings-page.component';
import { TeamRosterPageComponent } from './user/team-roster-page/team-roster-page.component';
import { SchedulePageComponent } from './user/schedule-page/schedule-page.component';
import { PlayerPageComponent } from './user/player-page/player-page.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { environment } from '../environments/environment';
import { HomePageComponent } from './user/home-page/home-page.component';
import { AdminHubComponent } from './admin/admin-hub/admin-hub.component';
import { ScheduleFormComponent } from './forms/schedule-form/schedule-form.component';
import { PlayerFormComponent } from './forms/player-form/player-form.component';
import { BbhldokuComponent } from './user/bbhldoku/bbhldoku.component';
import { DraftSimulatorComponent } from './user/draft-simulator/draft-simulator.component';
import { ResultsPageComponent } from './user/results-page/results-page.component';

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
    AdminHubComponent,
    ScheduleFormComponent,
    PlayerFormComponent,
    BbhldokuComponent,
    DraftSimulatorComponent,
    ResultsPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    //AngularFireModule.initializeApp(environment.firebase),
    //AngularFireAuthModule,
  ],
  providers: [ BsModalService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
