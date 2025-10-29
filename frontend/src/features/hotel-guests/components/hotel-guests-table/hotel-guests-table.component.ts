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
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ThemeService } from '../../../../core/services/theme/theme.service';
import { HotelGuestsDeleteModalComponent } from '../hotel-guests-delete-modal/hotel-guests-delete-modal.component';
import { FormatDocumentPipe } from '../../../../core/pipes/format-document.pipe';
import { FormatPhonePipe } from '../../../../core/pipes/format-phone.pipe';
import { HotelGuestsService } from '../../services/api/hotel-guests.service';
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
    MatDialogModule,
    FormatDocumentPipe,
    FormatPhonePipe,
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
  
  filterInHotel: boolean | null = null; 
  filterReserved: boolean | null = null;
  filterName: string | undefined;
  filterDocument: string | undefined;
  filterPhone: string | undefined;

  constructor(
    private pageService: HotelGuestsPageService,
    private dialog: MatDialog,
    private themeService: ThemeService,
    private router: Router
  ) {}

  openScheduleReservation(element: any) {
    
    this.router.navigate(['/reservas/adicionar', element.id]);
  }

  openEditGuest(element: any) {
    
    
    this.router.navigate(['/adicionar-hospede', element.id], {
      state: { guest: element },
    });
  }

  openDeleteGuest(element: any) {
    const panelClass = this.themeService.isDarkMode()
      ? 'dark__mode'
      : 'light__mode';

    const dialogRef = this.dialog.open(HotelGuestsDeleteModalComponent, {
      data: {
        id: element.id,
        fullName: element.name,
        document: element.document,
      },
      width: '420px',
      panelClass,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.loadPage(
        this.pageService.getLastCachedSnapshot()?.pagination.pageNumber || 0
      );
    });
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
