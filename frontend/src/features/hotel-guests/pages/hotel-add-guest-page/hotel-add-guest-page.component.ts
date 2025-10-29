import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HotelGuestsService } from '../../services/api/hotel-guests.service';
import {
  cpfValidator,
  phoneValidator,
} from '../../../../core/utils/validators';
import { CpfMaskDirective } from '../../../../core/directives/cpf-mask.directive';
import { PhoneMaskDirective } from '../../../../core/directives/phone-mask.directive';
import { Router } from '@angular/router';
import { BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-hotel-add-guest-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    CpfMaskDirective,
    PhoneMaskDirective,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    BreadcrumbsComponent,
  ],
  templateUrl: './hotel-add-guest-page.component.html',
  styleUrls: ['./hotel-add-guest-page.component.scss'],
})
export class HotelAddGuestPageComponent {
  readonly __breadcrumbsRef = BreadcrumbsComponent;
  form!: FormGroup;

  submitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private api: HotelGuestsService,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      document: ['', [Validators.required]],
      phone: ['', [Validators.required, phoneValidator()]],
      hasCar: [false, [Validators.required]],
    });
    this.form
      .get('document')
      ?.setValidators([Validators.required, cpfValidator()]);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.submitting = true;
    const name = this.form.get('name')?.value as string;
    const document = this.form.get('document')?.value as string;
    const phone = this.form.get('phone')?.value as string | undefined;
    const hasCar = !!this.form.get('hasCar')?.value;

    const payload: {
      name: string;
      document: string;
      phone?: string;
      hasCar?: boolean;
    } = {
      name: name || '',
      document: document || '',
      phone: phone || undefined,
      hasCar,
    };
    this.api.createGuest(payload).subscribe({
      next: (resp) => {
        this.snack.open('Hóspede criado com sucesso', 'Fechar', {
          duration: 3000,
        });
        this.form.reset({ hasCar: false });
        this.router.navigate(['/hospedes']);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Erro ao criar hóspede';
        this.snack.open(msg, 'Fechar', { duration: 5000 });
        this.submitting = false;
      },
      complete: () => (this.submitting = false),
    });
  }

  goToGuests() {
    this.router.navigate(['/hospedes']);
  }
}
