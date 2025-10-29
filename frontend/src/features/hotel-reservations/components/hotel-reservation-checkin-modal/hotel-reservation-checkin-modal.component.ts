
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HotelReservationsService } from '../../services/api/hotel-reservations.service';

@Component({
  selector: 'app-hotel-reservation-checkin-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './hotel-reservation-checkin-modal.component.html',
  styleUrls: ['./hotel-reservation-checkin-modal.component.scss']
})
export class HotelReservationCheckinModalComponent implements OnInit {
  loading = false;
  error: string | null = null;
  checkinLocal: string;

  constructor(
    public dialogRef: MatDialogRef<HotelReservationCheckinModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: number },
    private api: HotelReservationsService,
    private snackBar: MatSnackBar
  ) {
    const now = new Date();
    now.setSeconds(0, 0);
    this.checkinLocal = this.formatToLocalDatetime(now);
  }

  ngOnInit(): void {
    if (!this.data?.id) {
      this.error = 'ID da reserva não informado.';
    }
  }

  refreshToNow() {
    const now = new Date();
    now.setSeconds(0, 0);
    this.checkinLocal = this.formatToLocalDatetime(now);
  }

  onCancel() {
    this.dialogRef.close({ confirmed: false });
  }

  onConfirm() {
    if (!this.data?.id) {
      this.snackBar.open('ID da reserva ausente, não foi possível realizar o check-in', undefined, { duration: 5000 });
      return;
    }

    this.loading = true;
    this.api.checkin(this.data.id!, this.checkinLocal + ':00').subscribe({
      next: (res) => {
        this.loading = false;
        this.snackBar.open('Check-in realizado com sucesso.', undefined, { duration: 4000 });
        this.dialogRef.close({ confirmed: true });
      },
      error: (err: any) => {
        this.loading = false;
        const message = err?.error?.message || 'Erro ao processar o check-in.';
        this.snackBar.open(message, undefined, { duration: 6000 });
      }
    });
  }

  private formatToLocalDatetime(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
