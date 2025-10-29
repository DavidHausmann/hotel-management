import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HomePageService } from '../../services/application/home-page.service';
import { DashboardResponse } from '../../models/dashboard.model';
import { HomeChartComponent } from '../../components/home-chart/home-chart.component';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, HomeChartComponent],
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  private readonly __breadcrumbsRef = HomeChartComponent;
  dashboard$: Observable<DashboardResponse | null>;

  constructor(private homePageService: HomePageService) {
    this.dashboard$ = this.homePageService.dashboard$;
  }

  ngOnInit(): void {
    this.homePageService.loadDashboard().subscribe();
  }

  getDashboardSnapshot(): DashboardResponse | null {
    return this.homePageService.getDashboardSnapshot();
  }

  refreshDashboard(): void {
    this.homePageService.loadDashboard().subscribe();
  }

  getTotalReservationsContent(): string {
    const snap = this.getDashboardSnapshot();
    if (!snap) {
      return 'Carregando...';
    }
    const val = snap.totalReservations;
    if (val == null) {
      return '—';
    }
    if (val === 1) {
      return '1 reserva';
    }
    return `${val} reservas`;
  }
  

  getTotalActiveCheckinsContent(): string {
    const snap = this.getDashboardSnapshot();
    if (!snap) {
      return 'Carregando...';
    }

    const val = snap.totalActiveCheckins;
    if (val == null) {
      return '—';
    }

    if (val === 1) {
      return '1 check-in';
    }

    return `${val} check-ins`;
  }
  

  getTotalCurrentGuestsContent(): string {
    const snap = this.getDashboardSnapshot();
    if (!snap) {
      return 'Carregando...';
    }

    const val = snap.totalCurrentGuests;
    if (val == null) {
      return '—';
    }

    if (val === 1) {
      return '1 hóspede';
    }

    return `${val} hóspedes`;
  }
  

  getTotalCurrentCarsContent(): string {
    const snap = this.getDashboardSnapshot();
    if (!snap) {
      return 'Carregando...';
    }

    const val = snap.totalCurrentCars;
    if (val == null) {
      return '—';
    }

    if (val === 1) {
      return '1 carro';
    }

    return `${val} carros`;
  }
}
