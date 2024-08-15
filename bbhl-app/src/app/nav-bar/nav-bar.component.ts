import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  menuIsOpen: boolean = false;

  toggleMenu(): void {
    this.menuIsOpen = !this.menuIsOpen;
    console.log('Menu toggled. Current state:', this.menuIsOpen); 
  }
}
