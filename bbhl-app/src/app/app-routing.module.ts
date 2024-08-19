import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulePageComponent } from './user/schedule-page/schedule-page.component';
import { StandingsPageComponent } from './user/standings-page/standings-page.component';
import { PlayerStatsPageComponent } from './user/player-stats-page/player-stats-page.component';
import { TeamRosterPageComponent } from './user/team-roster-page/team-roster-page.component';
import { PlayerPageComponent } from './user/player-page/player-page.component';
import { HomePageComponent } from './user/home-page/home-page.component';
import { AdminHubComponent } from './admin/admin-hub/admin-hub.component';
import { ScheduleFormComponent } from './forms/schedule-form/schedule-form.component';
import { PlayerFormComponent } from './forms/player-form/player-form.component';
import { BoxscoreFormComponent } from './forms/boxscore-form/boxscore-form.component';
import { ResultsPageComponent } from './user/results-page/results-page.component';
import { BbhldokuComponent } from './user/bbhldoku/bbhldoku.component';
import { DraftSimulatorComponent } from './user/draft-simulator/draft-simulator.component';
import { BlackjackComponent } from './blackjack/blackjack.component';

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'standings', component: StandingsPageComponent },
  { path: 'schedule', component: SchedulePageComponent },
  { path: 'results/:id', component: ResultsPageComponent },
  { path: 'players', component: PlayerStatsPageComponent, pathMatch: 'full' },
  { path: 'players/:id', component: PlayerPageComponent, },
  { path: 'teams/:id', component: TeamRosterPageComponent },
  { path: 'bbhldoku', component: BbhldokuComponent, pathMatch: 'full' },
  { path: 'draft-sim', component: DraftSimulatorComponent, pathMatch: 'full' },
  { path: 'admin-hub', component: AdminHubComponent },
  { path: 'admin-hub/player-stats', component: BoxscoreFormComponent },
  { path: 'admin-hub/team-stats', component: BoxscoreFormComponent },
  { path: 'admin-hub/new-game', component: ScheduleFormComponent },
  { path: 'admin-hub/edit-player', component: PlayerFormComponent },
  { path: 'admin-hub/new-player', component: PlayerFormComponent },
  { path: 'admin-hub/upload', component: PlayerFormComponent },
  { path: 'blackjack', component: BlackjackComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
