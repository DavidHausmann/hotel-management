import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { HotelReservationsTableComponent } from '../../components/hotel-reservations-table/hotel-reservations-table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-reservations-page',
  standalone: true,
  imports: [BreadcrumbsComponent, HotelReservationsTableComponent],
  templateUrl: './hotel-reservations-page.component.html',
  styleUrls: ['./hotel-reservations-page.component.scss'],
})
export class HotelReservationsPageComponent {
  readonly __breadcrumbsRef = BreadcrumbsComponent;
  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/home']);
  }
}
