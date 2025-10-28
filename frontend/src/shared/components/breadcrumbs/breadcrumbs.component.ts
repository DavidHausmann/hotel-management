import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  imports: [],
  standalone: true,
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  exportAs: 'breadcrumbs',
})
export class BreadcrumbsComponent {
  @Input() previousPageText: string = 'Voltar';
  @Input() currentPageText: string = 'Página Atual';
  @Output() backFunction: EventEmitter<void> = new EventEmitter<void>();

  goToPreviousPage() {
    this.backFunction.emit();
  }
}
