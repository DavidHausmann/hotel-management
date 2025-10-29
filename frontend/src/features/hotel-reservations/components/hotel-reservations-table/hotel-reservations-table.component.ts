import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ThemeService } from '../../../../core/services/theme/theme.service';
import { HotelReservationsDeleteModalComponent } from '../hotel-reservations-delete-modal/hotel-reservations-delete-modal.component';
import { HotelReservationsService } from '../../services/api/hotel-reservations.service';
import { HotelReservationsPageService } from '../../services/application/hotel-reservations-page.service';


@Component({
  selector: 'app-hotel-reservations-table',
  templateUrl: './hotel-reservations-table.component.html',
  styleUrls: ['./hotel-reservations-table.component.scss'],
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
    MatDialogModule,
  ],
})
export class HotelReservationsTableComponent implements OnInit {
  readonly displayedColumns = [
    'id',
    'plannedStartDate',
    'plannedEndDate',
    'checkinTime',
    'checkoutTime',
    'status',
    'numberOfGuests',
    'totalAmount',
    'actions',
  ];

  // simple reactive state mirroring guests table
  pageSize = 10;

  get page$() {
    return this.pageService.getCachedReservationsPage();
  }
  get loading$() {
    return this.pageService.getLoading();
  }
  constructor(
    private pageService: HotelReservationsPageService,
    private dialog: MatDialog,
    private themeService: ThemeService,
    private api: HotelReservationsService
  ) {}

  ngOnInit(): void {
    this.loadPage(0);
  }

  openCheckout(element: any) {
    console.log('checkout', element);
  }

  openDeleteReservation(element: any) {
    const panelClass = this.themeService.isDarkMode()
      ? 'dark__mode'
      : 'light__mode';

    const dialogRef = this.dialog.open(HotelReservationsDeleteModalComponent, {
      data: {
        id: element.id,
        hotelGuestId: element.hotelGuestId,
      },
      width: '420px',
      panelClass,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      const current = this.pageService.getLastCachedSnapshot()?.pagination.pageNumber || 0;
      this.loadPage(current);
    });
  }

  onPageSizeChange(value: number) {
    this.pageSize = Math.min(value, 30);
  }

  prevPage() {
    if (!this.canPrev()) return;
    const current = this.pageService.getLastCachedSnapshot()!.pagination.pageNumber;
    this.loadPage(current - 1);
  }

  nextPage() {
    if (!this.canNext()) return;
    const current = this.pageService.getLastCachedSnapshot()!.pagination.pageNumber;
    this.loadPage(current + 1);
  }

  loadPage(pageNumber: number) {
    const options: { guestName?: string } = {};
    this.pageService.fetchReservationsPage(options, pageNumber, this.pageSize).subscribe({
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
}
