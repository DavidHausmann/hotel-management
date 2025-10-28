import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HotelGuestsPageService } from '../../services/application/hotel-guests-page.service';

@Component({
  selector: 'app-hotel-guests-table',
  templateUrl: './hotel-guests-table.component.html',
  styleUrls: ['./hotel-guests-table.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatProgressSpinnerModule, MatFormFieldModule, MatSelectModule]
})
export class HotelGuestsTableComponent {
  readonly displayedColumns = ['id', 'name', 'document', 'phone', 'hasCar'];

  // Observable of the cached page from the application service (getter ensures service is initialized)
  get page$() {
    return this.pageService.getCachedGuestsPage();
  }

  // Observable of loading state (getter to avoid using pageService before ctor runs)
  get loading$() {
    return this.pageService.getLoading();
  }

  // default page size used when loading
  pageSize = 10;

  constructor(private pageService: HotelGuestsPageService) {}

  ngOnInit(): void {
    // initial load
    this.loadPage(0);
  }

  // Load specific page and update cache (the service caches automatically)
  loadPage(pageNumber: number) {
    this.pageService.fetchGuestsPage({}, pageNumber, this.pageSize).subscribe({
      // no-op: fetchGuestsPage writes to the cache and components react via page$
      error: () => {
        // optionally handle error (could show snackbar) — no-op here
      }
    });
  }

  // Convenience helpers for prev/next navigation using cached snapshot
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
    const current = this.pageService.getLastCachedSnapshot()!.pagination.pageNumber;
    this.loadPage(current - 1);
  }

  nextPage() {
    if (!this.canNext()) return;
    const current = this.pageService.getLastCachedSnapshot()!.pagination.pageNumber;
    this.loadPage(current + 1);
  }

  onPageSizeChange(value: number) {
    // cap enforced in service; update local and reload first page
    this.pageSize = Math.min(value, 30);
    this.loadPage(0);
  }
}
