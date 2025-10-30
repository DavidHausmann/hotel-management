import { RouterOutlet, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../core/services/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'hotel-management-frontend';
  guests: any[] = [];
  isMenuOpen = false;

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.init();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
