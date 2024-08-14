import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player, Team, Drafter } from '../../types';
import { TeamsService } from '../../services/teams.service';
import { PlayersService } from 'src/app/services/players.service';
import { SortingService } from 'src/app/services/sorting.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-draft-simulator',
  templateUrl: './draft-simulator.component.html',
  styleUrls: ['./draft-simulator.component.css']
})

export class DraftSimulatorComponent {
  status: 'Ready' | 'In Progress' | 'Complete' = 'Ready';
  displaying: 'Available' | 'Roster' = 'Available';
  rounds: Number[] = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ]
  countdown: number = 90;
  countdownInterval: any;
  currentRound = 1;
  pickOfRound = 1;
  nextPick = 1;
  progress = 0;
  draftOrder: Drafter[] = [];
  available: Player[] = [];
  captains: Player[] = [];
  onTheClock: Drafter | null = null;
  draftingAs: Drafter | null = null;
  onDisplay: Drafter | null = null;
  onDisplayD: Player[] | null = [];
  onDisplayF: Player[] | null = [];
  onDisplayG: Player[] | null = [];
  draftLog: string[] = ['Click start draft to begin...'];
  sortColumn: string | null = 'points';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private teamService: TeamsService,
    private playersService: PlayersService,
    private sortingService: SortingService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.teamService.getDraftTeams()
    .subscribe(response => {
      this.captains = response.captains;
      this.draftOrder = this.initializeDrafters(response.teams);
      this.generateOrder();
    });

    this.playersService.getDraftPlayers()
    .subscribe(response => {
      this.available = response.players;
    });
  }

  ngOnDestroy() {
    this.clearCountdown();
  }

  generateOrder(): void {
    const shuffledArray = this.draftOrder.sort(() => Math.random() - 0.5);
    this.draftOrder = shuffledArray;
    this.onTheClock = this.draftOrder[0];
  }

  setDraftingAs(drafter: Drafter) {
    this.draftingAs = drafter;
  }

  setOnDisplay(drafter: Drafter) {
    this.onDisplay = drafter;
    this.balanceRoster();
  }

  initializeDrafters(teams: Team[]): Drafter[] {
    return teams.map(team => {
        const drafter: Drafter = {
            team: {
                name: team.name,
                logo: team.logo,
                captain: team.captain
            },
            roster: [],
            numD: 0,
            numF: 0,
            numG: 0
        };

        // Find and add the captain to the roster
        const captain = this.captains.find(captain => captain.name === team.captain);
        if (captain) {
            drafter.roster.push(captain);
            // Update the counts based on the captain's position
            switch (captain.position) {
                case 'Forward':
                    drafter.numF++;
                    break;
                case 'Defenseman':
                    drafter.numD++;
                    break;
                case 'Goalie':
                    drafter.numG++;
                    break;
            }
        }
        return drafter;
    });
  }
 
  startDraft(): void {
    this.status = 'In Progress';
    this.draftLog = ['Draft started!'];
    this.simToNextPick();
  }

  resetDraft(): void {
    // reset round & pick # and clear draft log
    this.currentRound = 1;
    this.nextPick = 1;
    this.draftLog = ['Click start draft to begin...'];
    
    // reinitialize the drafter objects
    this.teamService.getDraftTeams()
    .subscribe(response => {
      this.captains = response.captains;
      this.draftOrder = this.initializeDrafters(response.teams);;
    });
    
    // fetch draft eligible players and assign to available array
    this.playersService.getDraftPlayers()
    .subscribe(response => {
      this.available = response.players;
    });
    
    this.balanceRoster();
    this.status = 'Ready';
  }

  balanceRoster(): void {
    // Reset the positional arrays for the team to display
    this.onDisplayF = [];
    this.onDisplayD = [];
    this.onDisplayG = [];
  
    if (this.onDisplay) {
      // Separate hybrid players from other players
      const hybrids = this.onDisplay.roster.filter(player => player.position === 'Forward, Defenseman');
      const nonHybrids = this.onDisplay.roster.filter(player => player.position !== 'Forward, Defenseman');
      let overflow: Player[] = [];
  
      // Process non-hybrid players first
      for (let drafted of nonHybrids) {
        if (drafted.position === 'Forward') {
          if (this.onDisplayF.length < 9) {
            this.onDisplayF.push(drafted);
          } else {
            overflow.push(drafted);
          }
        } else if (drafted.position === 'Defenseman') {
          if (this.onDisplayD.length < 5) {
            this.onDisplayD.push(drafted);
          } else {
            overflow.push(drafted);
          }
        } else if (drafted.position === 'Goalie') {
          this.onDisplayG.push(drafted);
        }
      }
  
      // Process hybrid players and recalculate the ratio after each addition
      for (let drafted of hybrids) {
        const ratio = this.positionRatio(this.onDisplayF.length, this.onDisplayD.length);
  
        if (ratio < 1.8 && this.onDisplayF.length < 9) {
          this.onDisplayF.push(drafted);
        } else if (this.onDisplayD.length < 5) {
          this.onDisplayD.push(drafted);
        } else {
          // If the hybrid player cannot be added to either F or D due to overflow, push to overflow array
          overflow.push(drafted);
        }
      }
  
      // Add overflow players to the opposite array if applicable
      for (let drafted of overflow) {
        if (drafted.position === 'Forward' && this.onDisplayD.length < 5) {
          this.onDisplayD.push(drafted);
        } else if (drafted.position === 'Defenseman' && this.onDisplayF.length < 9) {
          this.onDisplayF.push(drafted);
        }
      }
    }
  }

  positionRatio(numF: number, numD: number): number {
    if (numD === 0) {
      if (numF === 0) {
        return 1; // Arbitrary choice when both are zero
      } else {
        return Number.POSITIVE_INFINITY; // No defensemen, but some forwards
      }
    }
    return numF / numD;
  }

  // take pick number as input and return the drafter who owns the pick (snake draft format)
  pickBelongsTo(nextPick: number): Drafter {
    const numTeams = this.draftOrder.length;
    const pickIndex = (nextPick - 1) % numTeams;

    if (this.currentRound % 2 === 1) {
      return this.draftOrder[pickIndex];
    } 
    else {
      return this.draftOrder[numTeams - 1 - pickIndex];
    }
  }

  // take player object as input and return the players index in the available array
  lookup(selection: Player): number {
    const index = this.available.findIndex(player => player === selection);
    return index;
  }

  draftPlayer(selection: Player, onTheClock: Drafter) {
    onTheClock.roster.push(selection);
        
    switch (selection.position) {
      case 'Forward':
        onTheClock.numF++;
        break;
      case 'Defenseman':
        onTheClock.numD++;
        break;
      case 'Goalie':
        onTheClock.numG++;
        break;
    }
    
    let index = this.lookup(selection);
    this.available.splice(index, 1);
    this.draftLog.push(onTheClock['team'].name + ' select ' + selection.name + ' with pick #' + this.nextPick);
  }

  userSelects(selection: Player): void {
    if (this.onTheClock && this.onTheClock === this.draftingAs) {
      this.draftPlayer(selection, this.onTheClock);
      this.clearCountdown();
      this.advancePick();
      this.simToNextPick();
    }
  }

  autoSelect(): void {
    if (this.draftingAs) {
      const selection = this.evaluate(this.draftingAs);
      if (selection) {
        this.draftPlayer(selection, this.draftingAs);
        this.advancePick();
      }
    }
  }

  advancePick(): void {
    if (this.available.length > 0) {
      this.progress = (this.nextPick / 98) * 100;
      this.nextPick++;
      this.pickOfRound++;
      
      if (this.nextPick % this.draftOrder.length === 1) {
        this.pickOfRound = 1;
        this.currentRound++;
        this.draftLog.push(' --- ROUND ' + this.currentRound + ' ---');
      }
      this.onTheClock = this.pickBelongsTo(this.nextPick);
    }
  }

  async simToNextPick(): Promise<void> {
    
    // simulate selections until the next user pick or the end of draft
    while (this.pickBelongsTo(this.nextPick) !== this.draftingAs) {
      await delay(3000);
      if (this.onTheClock) {
        const selection = this.evaluate(this.onTheClock);
        if (selection) {
          this.draftPlayer(selection, this.onTheClock);
        }
        else {
          // where no players remain in the available array, end the draft
          if (this.available.length === 0) {
            this.status = 'Complete';
            this.progress = 100;

            // display roster view after the draft is completed
            if (this.displaying === 'Available') {
              this.setDisplay('Roster');
            }
            else {
              this.balanceRoster();
            }
            break;
          }
          this.draftPlayer(this.available[0], this.onTheClock);
        }
      }
      this.advancePick();
    }
    
    // start countdown for user selections
    if (this.status !== 'Complete') {
      this.startCountdown();
      if (this.displaying === 'Roster') {
        this.setDisplay('Available');
      }
    }
  }

  evaluate(onTheClock: Drafter): Player | null {
    if (this.available.length === 0) {
      return null;
    }
  
    let bpa = this.getBPA();
    let bpaSet = this.getAvailablePlayersByRank(bpa);
    bpaSet = this.validatePositions(bpaSet, onTheClock);
  
    while (bpaSet.length === 0 && bpa > 0) {
      bpa -= 0.25;
      bpaSet = this.getAvailablePlayersByRank(bpa); 
      bpaSet = this.validatePositions(bpaSet, onTheClock);
    }
  
    const selection = Math.floor(Math.random() * bpaSet.length);
    return bpaSet[selection];
  }

  getBPA(): number {
    let bpaRank = 0;
    for (let i = 0; i < this.available.length; i++) {
      if (this.available[i].player_rank > bpaRank) {
        bpaRank = this.available[i].player_rank;
      } 
    }
    return bpaRank;
  }

  getAvailablePlayersByRank(rank: number): Player[] {
    const playerSet: Player[] = [];
    const precision = 0.01;
  
    for (let i = 0; i < this.available.length; i++) {
      if (Math.abs(this.available[i].player_rank - rank) < precision) {
        playerSet.push(this.available[i]);
      }
    }
    return playerSet;
  }
  

  validatePositions(players: Player[], drafter: Drafter): Player[] {
    return players.filter(player => {
      if (player.position === 'Goalie' && drafter.numG > 0) {
        return false;
      }
      if (player.position === 'Forward' && drafter.numF >= 10) {
        return false;
      }
      if (player.position === 'Defenseman' && drafter.numD >= 6) {
        return false;
      }
      return true;
    });
  }

  startCountdown() {
    this.clearCountdown();

    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.autoSelect();
        this.clearCountdown();
        this.simToNextPick();
      }
    }, 1000);
  }

  clearCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdown = 90;
    }
  }

  formatCountdown(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  sortTable(column: string | null, direction: 'asc' | 'desc'): void {
    this.available = this.sortingService.sort(this.available, column, direction);
  }

  toggleSort(column: string): void {
    if (column === this.sortColumn) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }

    this.sortTable(this.sortColumn, this.sortDirection);
  }

  setDisplay(type: "Available" | "Roster"): void {
    this.displaying = type;
    this.onDisplay = this.draftingAs === null ? this.draftOrder[0] : this.draftingAs;
    this.balanceRoster();
  }

}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
