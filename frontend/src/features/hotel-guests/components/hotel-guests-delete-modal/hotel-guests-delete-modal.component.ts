import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HotelGuestsService } from '../../services/api/hotel-guests.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-hotel-guests-delete-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  standalone: true,
  templateUrl: './hotel-guests-delete-modal.component.html',
  styleUrls: ['./hotel-guests-delete-modal.component.scss'],
})
export class HotelGuestsDeleteModalComponent {
  loading = false;
  constructor(
    public dialogRef: MatDialogRef<HotelGuestsDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { id?: number; fullName?: string; document?: string },
    private api: HotelGuestsService,
    private snackBar: MatSnackBar
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if (!this.data?.id) {
      this.snackBar.open('ID do hóspede não informado.', undefined, {
        duration: 4000,
      });
      return;
    }

    this.loading = true;
    this.api.deleteGuest(this.data.id).subscribe({
      next: () => {
        this.snackBar.open('Hóspede excluído com sucesso.', undefined, {
          duration: 3000,
        });
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        const msg =
          err?.error?.message ||
          (err.status === 409
            ? 'Não é possível excluir hóspede que está hospedado no hotel.'
            : 'Erro ao excluir hóspede.');
        this.snackBar.open(msg, undefined, { duration: 5000 });
        this.loading = false;
      },
    });
  }
}
