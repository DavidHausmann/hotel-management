import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HotelGuestsPageService } from '../../services/application/hotel-guests-page.service';

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
    this.pageService.fetchGuestsPage({}, pageNumber, this.pageSize).subscribe({
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
}
