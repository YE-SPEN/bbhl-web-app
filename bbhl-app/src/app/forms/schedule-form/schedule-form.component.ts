import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game, Team } from '../../types';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})

export class ScheduleFormComponent {
  formSubmitted: boolean = false;
  teamNames: Team[] = []
  formData = {
    date: '',
    time: '',
    homeTeam: '',
    awayTeam: '',
  };

  constructor(
    private http: HttpClient,
    private scheduleService: ScheduleService,
  ) { }

  ngOnInit(): void {
    this.scheduleService.getTeamNames()
      .subscribe(response => {
        this.teamNames = response.teamNames;
      });
  }

  onSubmit() {
    const submissionData = {
      date: this.formData.date,
      time: this.formatTime(this.formData.time),
      homeTeam: this.formData.homeTeam,
      awayTeam: this.formData.awayTeam,
      gameID: this.generateGameID(this.formatTime(this.formData.time), this.formData.date),
    };

    this.http.post('/api/admin-hub/new-game', submissionData)
      .subscribe(response => {
        console.log('New game added to schedule.', response);
        this.formSubmitted = true;
        setTimeout(() => {
          this.formSubmitted = false;
        }, 3000);
        this.resetForm();
      }, error => {
        console.error('Error submitting form', error, submissionData);
      });
  }

  generateGameID(timeStr: string, dateStr: string): string {
    let hours = parseInt(timeStr.split(':')[0]);
    const date = new Date(dateStr + 'T00:00:00');
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear() % 100;

    const gameID = `${hours}-${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${year.toString().padStart(2, '0')}`;

    return gameID;
  }

  formatTime(timeStr: string): string {
    let hours = parseInt(timeStr.split(':')[0]);
    const minutes = timeStr.split(':')[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  resetForm() {
    this.formData.date = '';
    this.formData.time = '';
    this.formData.homeTeam = '';
    this.formData.awayTeam = '';
  }
}
