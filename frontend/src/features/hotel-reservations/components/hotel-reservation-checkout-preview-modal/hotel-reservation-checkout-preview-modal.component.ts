import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HotelReservationsService } from '../../services/api/hotel-reservations.service';

@Component({
  selector: 'app-hotel-reservation-checkout-preview-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './hotel-reservation-checkout-preview-modal.component.html',
  styleUrls: ['./hotel-reservation-checkout-preview-modal.component.scss'],
})
export class HotelReservationCheckoutPreviewModalComponent implements OnInit {
  loading = false;
  error: string | null = null;
  preview: {
    totalWeekdays: number;
    totalWeekends: number;
    parkingWeekdays: number;
    parkingWeekends: number;
    extraFees: number;
    totalAmount: number;
  } | null = null;

  checkoutLocal: string;

  constructor(
    public dialogRef: MatDialogRef<HotelReservationCheckoutPreviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: number },
    private api: HotelReservationsService,
    private snackBar: MatSnackBar
  ) {
    const now = new Date();
    now.setSeconds(0, 0);
    this.checkoutLocal = this.formatToLocalDatetime(now);
  }

  ngOnInit(): void {
    if (!this.data?.id) {
      this.error = 'ID da reserva não informado.';
      return;
    }

    this.loadPreview();
  }

  loadPreview(updateInput: boolean = false) {
    if (updateInput) {
      const now = new Date();
      now.setSeconds(0, 0);
      this.checkoutLocal = this.formatToLocalDatetime(now);
    }

    this.loading = true;
    this.error = null;
    const iso = this.checkoutLocal;
    const checkoutTime = iso + ':00';

    this.api.getCheckoutPreview(this.data.id!, checkoutTime).subscribe({
      next: (res) => {
        this.preview = res;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.error =
          err?.error?.message || 'Erro ao carregar preview de checkout.';
        this.snackBar.open(
          this.error || 'Erro ao carregar preview de checkout.',
          undefined,
          { duration: 5000 }
        );
      },
    });
  }

  onCancel() {
    this.dialogRef.close({ confirmed: false });
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

  onConfirm() {
    if (!this.data?.id) {
      this.snackBar.open('ID da reserva ausente, não foi possível realizar o checkout', undefined, { duration: 5000 });
      return;
    }

    this.loading = true;
    this.api.checkout(this.data.id!, this.checkoutLocal + ':00').subscribe({
      next: (res) => {
        this.loading = false;
        this.snackBar.open('Check-out realizado com sucesso.', undefined, { duration: 4000 });
        this.dialogRef.close({ confirmed: true });
      },
      error: (err: any) => {
        this.loading = false;
        const message = err?.error?.message || 'Erro ao processar o checkout.';
        this.snackBar.open(message, undefined, { duration: 6000 });
      },
    });
  }
}
