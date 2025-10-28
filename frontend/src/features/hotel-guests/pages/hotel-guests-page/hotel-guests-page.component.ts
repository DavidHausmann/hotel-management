import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { HotelGuestsTableComponent } from '../../components/hotel-guests-table/hotel-guests-table.component';

@Component({
  selector: 'app-hotel-guests-page',
  imports: [BreadcrumbsComponent, HotelGuestsTableComponent],
  standalone: true,
  templateUrl: './hotel-guests-page.component.html',
  styleUrls: ['./hotel-guests-page.component.scss'],
})
export class HotelGuestsPageComponent {
  readonly __breadcrumbsRef = BreadcrumbsComponent;
  readonly __hotelGuestsTableRef = HotelGuestsTableComponent;
  constructor(private router: Router) {}
  
  goToHome() {
    this.router.navigate(['/home']);
  }
}
