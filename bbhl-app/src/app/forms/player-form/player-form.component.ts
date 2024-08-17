import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Player } from 'src/app/types';
import { PlayersService } from 'src/app/services/players.service';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.css'
})
export class PlayerFormComponent {
  action: 'add' | 'edit' | null = null;
  formSubmitted: boolean = false;
  allPlayers: Player[] = [];
  filteredPlayers: Player[] = [];
  playerToEdit: Player | null = null;
  searchTerm: string = '';
  currentIndex: number = -1;
  formData = {
    oldName: '',
    name: '',
    position: '',
    picture: '',
  };

  constructor(
    private http: HttpClient,
    private playerService: PlayersService,
  ) { }

  ngOnInit(): void {
    this.playerService.getAllPlayers()
      .subscribe(response => {
        this.allPlayers = response;
        console.log(this.allPlayers);
      });
  }

  setAction(action: 'add' | 'edit' | null): void {
    this.action = action;
  }

  searchPlayers(): void {
    console.log(this.searchTerm);
    this.filteredPlayers = this.allPlayers.filter(player =>
      player.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  searchListNav(event: KeyboardEvent): void {
      if (this.filteredPlayers.length) {
          if (event.key === 'ArrowDown') {
              this.currentIndex = (this.currentIndex + 1) % this.filteredPlayers.length;
          } else if (event.key === 'ArrowUp') {
              this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.filteredPlayers.length - 1;
          } else if (event.key === 'Enter') {
              if (this.currentIndex >= 0 && this.currentIndex < this.filteredPlayers.length) {
                  this.selectPlayer(this.filteredPlayers[this.currentIndex]);
              }
          }
      }
  }

  selectPlayer(player: Player): void {
    this.playerToEdit = player;
    this.filteredPlayers = [];
    this.searchTerm = '';
    this.formData.position = this.playerToEdit.position;
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.filteredPlayers = [...this.allPlayers];
  }

  uploadFile(event: any): boolean {
    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.http.post('/api/admin-hub/upload', formData).subscribe(
        (response: any) => {
          console.log('File uploaded successfully:', response.fileUrl);
          this.formData.picture = response.fileUrl;
          return true;
        },
        (error) => {
          console.error('File upload failed:', error);
          return false;
        }
      );
    }
    return false;
  }

  generateID(name: string): string {
    const id = name.toLowerCase().replace(/\s+/g, '');
    return id;
  }
  
  onSubmit() {
    const submissionData = {
      oldName: this.playerToEdit?.name,
      id: this.generateID(this.formData.name),
      name: this.formData.name,
      position: this.formData.position,
      picture: this.formData.picture
   };

    this.http.post('/api/admin-hub/new-player', submissionData)
      .subscribe(response => {
        console.log('New player added to database.', response);
        this.formSubmitted = true;
        setTimeout(() => {
          this.formSubmitted = false;
        }, 3000);
        this.resetForm();
      }, error => {
        console.error('Error submitting form', error, submissionData);
      });
  }

  resetForm() {
    this.formData.oldName = '';
    this.formData.name = '';
    this.formData.position = '';
    this.formData.picture = '';
  }

}
