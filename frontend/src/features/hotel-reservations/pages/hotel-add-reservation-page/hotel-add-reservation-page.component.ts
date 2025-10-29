import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { HotelReservationsService } from '../../services/api/hotel-reservations.service';

@Component({
  selector: 'app-hotel-add-reservation-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    BreadcrumbsComponent,
  ],
  templateUrl: './hotel-add-reservation-page.component.html',
  styleUrls: ['./hotel-add-reservation-page.component.scss'],
})
export class HotelAddReservationPageComponent {
  form: FormGroup;
  submitting = false;
  hotelGuestId?: number;
  today: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reservationsApi: HotelReservationsService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      plannedStartDate: [null, Validators.required],
      plannedEndDate: [null, Validators.required],
      numberOfGuests: [1, [Validators.required, Validators.min(1)]],
    });

    
    
    this.form.setValidators((control) => {
      const group = control as FormGroup;
      return this.dateRangeValidator(group);
    });
    
    this.form.valueChanges.subscribe(() => this.form.updateValueAndValidity({ onlySelf: true, emitEvent: false }));

    
    this.form.get('plannedStartDate')?.valueChanges.subscribe((val: Date | null) => {
      if (!val) return;
      try {
        const s = new Date(val.getFullYear(), val.getMonth(), val.getDate());
        const minEnd = new Date(s.getTime() + 24 * 60 * 60 * 1000);
        const endCtrl = this.form.get('plannedEndDate');
        const currentEnd: Date | null = endCtrl?.value;
        if (!currentEnd) {
          endCtrl?.setValue(minEnd);
        } else {
          const e = new Date(currentEnd.getFullYear(), currentEnd.getMonth(), currentEnd.getDate());
          if (e.getTime() < minEnd.getTime()) {
            endCtrl?.setValue(minEnd);
          }
        }
      } catch (error) {
        
      }
    });

    const idParam = this.route.snapshot.paramMap.get('hotelGuestId');
    if (idParam) {
      this.hotelGuestId = Number(idParam);
    }
  }

  goBack() {
    this.router.navigate(['/hospedes']);
  }

  onSubmit() {
    if (!this.form.valid || !this.hotelGuestId) return;
    this.submitting = true;

    const start: Date = this.form.value.plannedStartDate;
    const end: Date = this.form.value.plannedEndDate;
    const body = {
      plannedStartDate: start.toISOString().slice(0, 10),
      plannedEndDate: end.toISOString().slice(0, 10),
      numberOfGuests: this.form.value.numberOfGuests,
    };

    this.reservationsApi.createReservation(this.hotelGuestId, body).subscribe({
      next: (resp) => {
        this.submitting = false;
        this.snackBar.open('Reserva agendada com sucesso', 'Fechar', { duration: 3000 });
        this.router.navigate(['/reservas']);
      },
      error: (err) => {
        this.submitting = false;
        const msg = err?.error?.message || 'Erro ao criar reserva';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
      },
    });
  }

  
  startDateFilterFn = (d: Date | null): boolean => {
    if (!d) return true;
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const today = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
    return date >= today;
  };

  
  endDateFilterFn = (d: Date | null): boolean => {
    if (!d) return true;
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const startVal = this.form.get('plannedStartDate')?.value;
    
    let minDate: Date;
    if (startVal) {
      const s = new Date(startVal.getFullYear(), startVal.getMonth(), startVal.getDate());
      minDate = new Date(s.getTime() + 24 * 60 * 60 * 1000);
    } else {
      minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
      minDate = new Date(minDate.getTime() + 24 * 60 * 60 * 1000);
    }
    return date >= minDate;
  };

  
  private dateRangeValidator = (group: FormGroup) => {
    const start = group.get('plannedStartDate')?.value;
    const end = group.get('plannedEndDate')?.value;
    if (start && end) {
      const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      const msPerDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round((e.getTime() - s.getTime()) / msPerDay);
      
      if (diffDays < 1) {
        return { dateRange: true };
      }
    }
    return null;
  };
}
