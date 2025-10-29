import { Component, ViewChild } from '@angular/core';
import { BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { HotelReservationsTableComponent } from '../../components/hotel-reservations-table/hotel-reservations-table.component';
import { Router } from '@angular/router';
import { FilterComponent } from '../../../../shared/components/filter-component/filter-component.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-hotel-reservations-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbsComponent,
    HotelReservationsTableComponent,
    FilterComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './hotel-reservations-page.component.html',
  styleUrls: ['./hotel-reservations-page.component.scss'],
})
export class HotelReservationsPageComponent {
  readonly __breadcrumbsRef = BreadcrumbsComponent;
  readonly __hotelReservationsTableRef = HotelReservationsTableComponent;

  @ViewChild(HotelReservationsTableComponent) table!: HotelReservationsTableComponent;
  @ViewChild(FilterComponent) filterComp?: FilterComponent;

  // UI state for filter panel
  showFilters = false;
  filterName = '';
  filterDocument = '';
  filterPhone = '';
  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;

  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/home']);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onApplyFilters() {
    if (!this.table) return;
    this.table.filterName = this.filterName || undefined;
    this.table.filterDocument = this.filterDocument || undefined;
    this.table.filterPhone = this.filterPhone || undefined;
    this.table.filterStartDate = this.filterStartDate
      ? this.filterStartDate.toISOString().slice(0, 10)
      : undefined;
    this.table.filterEndDate = this.filterEndDate
      ? this.filterEndDate.toISOString().slice(0, 10)
      : undefined;
    this.table.loadPage(0);
    this.filterComp?.startClose();
  }

  onClearFilters() {
    this.filterName = '';
    this.filterDocument = '';
    this.filterPhone = '';
    this.filterStartDate = null;
    this.filterEndDate = null;
    this.table.filterName = undefined;
    this.table.filterDocument = undefined;
    this.table.filterPhone = undefined;
    this.table.filterStartDate = undefined;
    this.table.filterEndDate = undefined;
    this.table.loadPage(0);
    this.filterComp?.startClose();
  }

  onCloseFilters() {
    this.showFilters = false;
  }
}
