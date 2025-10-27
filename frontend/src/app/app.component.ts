import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'frontend';
  guests: any[] = [];

  constructor(private http: HttpClient, public themeService: ThemeService) {}

  ngOnInit() {
    this.fetchGuests();
  }

  fetchGuests() {
    this.http.get<any[]>('http://localhost:8080/api/guest').subscribe({
      next: (data) => {
        this.guests = data;
      },
      error: (error) => {
        console.error('Error fetching guests:', error);
      },
    });
  }
}
