import { Component, TemplateRef } from '@angular/core';
import { Player, Team, Game } from '../../types'
import { ScheduleService } from 'src/app/services/schedule.service';
import { TeamsService } from 'src/app/services/teams.service';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-admin-hub',
  templateUrl: './admin-hub.component.html',
  styleUrls: ['./admin-hub.component.css'],
})

export class AdminHubComponent {
  action: '' | 'addToSchedule' | 'recordResult' | 'editPlayer' = '';

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.action = '';
  }

  setAction(newAction: '' | 'addToSchedule' | 'recordResult' | 'editPlayer'): void {
    this.action = newAction;
  }
  
}