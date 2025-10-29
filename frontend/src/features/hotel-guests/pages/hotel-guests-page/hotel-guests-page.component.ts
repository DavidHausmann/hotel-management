import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { HotelGuestsTableComponent } from '../../components/hotel-guests-table/hotel-guests-table.component';
import { FilterComponent } from '../../../../shared/components/filter-component/filter-component.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hotel-guests-page',
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbsComponent,
    HotelGuestsTableComponent,
    FilterComponent,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule,
  ],
  standalone: true,
  templateUrl: './hotel-guests-page.component.html',
  styleUrls: ['./hotel-guests-page.component.scss'],
})
export class HotelGuestsPageComponent {
  readonly __breadcrumbsRef = BreadcrumbsComponent;
  readonly __hotelGuestsTableRef = HotelGuestsTableComponent;

  @ViewChild(HotelGuestsTableComponent) table!: HotelGuestsTableComponent;
  @ViewChild(FilterComponent) filterComp?: FilterComponent;

  // UI state for filter panel
  showFilters = false;
  filterName = '';
  filterDocument = '';
  filterPhone = '';
  // single status select: '', 'CHECKED_IN' (maps to inHotel), 'RESERVED' (maps to reserved)
  filterStatus: '' | 'CHECKED_IN' | 'RESERVED' = '';

  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToAddGuest() {
    this.router.navigateByUrl('/adicionar-hospede');
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onApplyFilters() {
    if (!this.table) return;
    this.table.filterName = this.filterName || undefined;
    this.table.filterDocument = this.filterDocument || undefined;
    this.table.filterPhone = this.filterPhone || undefined;
    // map status to existing boolean filters expected by the table/service
    if (this.filterStatus === 'CHECKED_IN') {
      this.table.filterInHotel = true;
      this.table.filterReserved = null;
    } else if (this.filterStatus === 'RESERVED') {
      this.table.filterInHotel = null;
      this.table.filterReserved = true;
    } else {
      this.table.filterInHotel = null;
      this.table.filterReserved = null;
    }
    this.table.loadPage(0);
    // request the filter component to animate out; it will emit closeEvent when done
    this.filterComp?.startClose();
  }

  onClearFilters() {
    // reset local fields
  this.filterName = '';
  this.filterDocument = '';
  this.filterPhone = '';
  this.filterStatus = '';
    // ask table to clear its filters and reload
    this.table.clearFilters();
    // animate out the filter panel
    this.filterComp?.startClose();
  }

  onCloseFilters() {
    // Close the filter panel without applying or clearing filters.
    this.showFilters = false;
  }
}
