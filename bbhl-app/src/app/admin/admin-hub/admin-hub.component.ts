import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';


interface ActionCompletedEvent {
  message: string;
  success: boolean;
}

@Component({
  selector: 'app-admin-hub',
  templateUrl: './admin-hub.component.html',
  styleUrls: ['./admin-hub.component.css'],
})

export class AdminHubComponent {
  action: '' | 'addToSchedule' | 'recordResult' | 'editPlayer' = '';
  @ViewChild('toastSuccess', { static: false }) toastSuccess!: ElementRef<HTMLDivElement>;
  @ViewChild('toastError', { static: false }) toastError!: ElementRef<HTMLDivElement>;
  toastMessage: string | null = null;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.action = '';
  }

  setAction(newAction: '' | 'addToSchedule' | 'recordResult' | 'editPlayer'): void {
    this.action = newAction;
  }

  showToast(message: string, success: boolean): void {
    let toast: HTMLElement | null = success ? this.toastSuccess.nativeElement : this.toastError.nativeElement;
    
    if (toast) {
      this.toastMessage = message;
      toast.classList.add('show');
      toast.classList.remove('hidden');
      
      setTimeout(() => {
        this.dismissToast(toast);
      }, 5000);
    }
  }

  dismissToast(toast: HTMLElement): void {
    if (toast) {
      toast.classList.remove('show');
      toast.classList.add('hidden');
    }
  }

  onActionCompleted(event: ActionCompletedEvent): void {
    if (event.success) {
      this.showToast(event.message, true);
    } else {
      this.showToast(event.message, false);
    }
    this.action = '';
  }
  
}