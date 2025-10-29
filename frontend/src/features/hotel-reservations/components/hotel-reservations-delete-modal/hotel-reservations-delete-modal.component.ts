import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HotelReservationsService } from '../../services/api/hotel-reservations.service';

@Component({
  selector: 'app-hotel-reservations-delete-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  standalone: true,
  templateUrl: './hotel-reservations-delete-modal.component.html',
  styleUrls: ['./hotel-reservations-delete-modal.component.scss'],
})
export class HotelReservationsDeleteModalComponent {
  loading = false;
  constructor(
    public dialogRef: MatDialogRef<HotelReservationsDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA)
  public data: { id?: number; hotelGuestId?: number },
    private api: HotelReservationsService,
    private snackBar: MatSnackBar
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if (!this.data?.id) {
      this.snackBar.open('ID da reserva não informado.', undefined, {
        duration: 4000,
      });
      return;
    }

    this.loading = true;
    this.api.deleteReservation(this.data.id).subscribe({
      next: () => {
        this.snackBar.open('Reserva excluída com sucesso.', undefined, {
          duration: 3000,
        });
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        const msg =
          err?.error?.message || (err?.status === 409 ? 'Conflito ao excluir reserva.' : 'Erro ao excluir reserva.');
        this.snackBar.open(msg, undefined, { duration: 5000 });
        this.loading = false;
      },
    });
  }
}
