import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HotelGuestsPageService } from '../../services/application/hotel-guests-page.service';
import { HotelGuestFilters } from '../../shared/hotel-guests.model';

@Component({
  selector: 'app-hotel-guests-table',
  templateUrl: './hotel-guests-table.component.html',
  styleUrls: ['./hotel-guests-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatTooltipModule,
  ],
})
export class HotelGuestsTableComponent {
  readonly displayedColumns = [
    'id',
    'name',
    'document',
    'phone',
    'hasCar',
    'actions',
  ];
  get page$() {
    return this.pageService.getCachedGuestsPage();
  }
  get loading$() {
    return this.pageService.getLoading();
  }
  pageSize = 10;
  // filter state
  filterInHotel: boolean | null = null; // null -> not applied; true/false -> applied
  filterReserved: boolean | null = null;
  filterName: string | undefined;
  filterDocument: string | undefined;
  filterPhone: string | undefined;

  constructor(private pageService: HotelGuestsPageService) {}

  openEditGuest(element: any) {
    console.log('openEditGuest', element);
  }

  openDeleteGuest(element: any) {
    console.log('openDeleteGuest', element);
  }

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(pageNumber: number) {
    const options: HotelGuestFilters = {};
    if (this.filterName) options.name = this.filterName;
    if (this.filterDocument) options.document = this.filterDocument;
    if (this.filterPhone) options.phone = this.filterPhone;
    if (this.filterInHotel !== null) options.inHotel = this.filterInHotel;
    if (this.filterReserved !== null) options.reserved = this.filterReserved;

    this.pageService
      .fetchGuestsPage(options, pageNumber, this.pageSize)
      .subscribe({
        error: () => {},
      });
  }

  canPrev(): boolean {
    const snap = this.pageService.getLastCachedSnapshot();
    return !!(snap && snap.pagination.pageNumber > 0);
  }

  canNext(): boolean {
    const snap = this.pageService.getLastCachedSnapshot();
    if (!snap) return false;
    return snap.pagination.pageNumber + 1 < snap.pagination.totalPages;
  }

  prevPage() {
    if (!this.canPrev()) return;
    const current =
      this.pageService.getLastCachedSnapshot()!.pagination.pageNumber;
    this.loadPage(current - 1);
  }

  nextPage() {
    if (!this.canNext()) return;
    const current =
      this.pageService.getLastCachedSnapshot()!.pagination.pageNumber;
    this.loadPage(current + 1);
  }

  onPageSizeChange(value: number) {
    this.pageSize = Math.min(value, 30);
    this.loadPage(0);
  }

  toggleInHotelCheckbox(checked: boolean) {
    this.filterInHotel = checked;
    this.loadPage(0);
  }

  toggleReservedCheckbox(checked: boolean) {
    this.filterReserved = checked;
    this.loadPage(0);
  }

  clearFilters() {
    this.filterInHotel = null;
    this.filterReserved = null;
    this.filterName = undefined;
    this.filterDocument = undefined;
    this.filterPhone = undefined;
    this.loadPage(0);
  }
}
