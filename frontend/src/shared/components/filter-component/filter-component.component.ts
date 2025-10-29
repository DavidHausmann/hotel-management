import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../../core/services/theme/theme.service';

@Component({
  selector: 'app-filter-component',
  templateUrl: './filter-component.component.html',
  styleUrls: ['./filter-component.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule],
})
export class FilterComponent {
  @Output() applyFiltersEvent = new EventEmitter<void>();
  @Output() clearFiltersEvent = new EventEmitter<void>();
  @Output() closeEvent = new EventEmitter<void>();
  isClosing = false;

  constructor(public themeService: ThemeService) {}

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  onClick(e: Event) {
    // stop clicks from bubbling to outer UI if used inside overlays
    e.stopPropagation();
  }

  applyFilters() {
    this.applyFiltersEvent.emit();
  }

  clearFilters() {
    this.clearFiltersEvent.emit();
  }
  close() {
    // request an animated close
    this.startClose();
  }

  startClose() {
    if (this.isClosing) return;
    this.isClosing = true;
    // safety fallback in case animationend isn't fired
    setTimeout(() => {
      if (this.isClosing) {
        this.isClosing = false;
        this.closeEvent.emit();
      }
    }, 320);
  }

  onAnimationEnd(event: AnimationEvent) {
    if (this.isClosing) {
      this.isClosing = false;
      this.closeEvent.emit();
    }
  }
}

