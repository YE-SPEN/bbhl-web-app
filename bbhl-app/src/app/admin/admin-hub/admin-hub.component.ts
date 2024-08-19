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
  selectedGame: Game | null = null;
  upcomingGames: Game[] = [];
  matchup: Team[] = [];
  modalRef!: BsModalRef;

  constructor(
    private http: HttpClient,
    private scheduleService: ScheduleService,
    private teamService: TeamsService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.action = '';
  }

  setAction(newAction: '' | 'addToSchedule' | 'recordResult' | 'editPlayer'): void {
    this.action = newAction;

    switch (this.action) {
      case 'recordResult':
        this.scheduleService.getUpcomingGames()
        .subscribe(response => {
          this.upcomingGames = response.upcomingGames;
        });
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
    this.action = '';
    this.selectedGame = null;
  }
  
}