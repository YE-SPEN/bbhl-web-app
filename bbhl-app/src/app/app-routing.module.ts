import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { StandingsPageComponent } from './standings-page/standings-page.component';
import { PlayerStatsPageComponent } from './player-stats-page/player-stats-page.component';
import { TeamRosterPageComponent } from './team-roster-page/team-roster-page.component';
import { PlayerPageComponent } from './player-page/player-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/players', pathMatch: 'full' },
  { path: 'schedule', component: SchedulePageComponent },
  { path: 'standings', component: StandingsPageComponent },
  { path: 'players', component: PlayerStatsPageComponent, pathMatch: 'full' },
  { path: 'players/:id', component: PlayerPageComponent, },
  { path: 'teams/:id', component: TeamRosterPageComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
