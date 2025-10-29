import { Component, OnInit } from '@angular/core';
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
import { Router, ActivatedRoute } from '@angular/router';
import { FormatPhonePipe } from '../../../../core/pipes/format-phone.pipe';
import { FormatDocumentPipe } from '../../../../core/pipes/format-document.pipe';
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
  isEdit = false;
  guestId: number | null = null;
  readonly __breadcrumbsRef = BreadcrumbsComponent;
  form!: FormGroup;

  submitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private api: HotelGuestsService,
    private snack: MatSnackBar,
    private router: Router
    ,
    private route: ActivatedRoute
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

  ngOnInit(): void {
    // First, check whether navigation state carried a guest object (when navigating from the table).
    // Using navigation state avoids an extra HTTP request when the table already has the guest data.
    const navState: any = history.state || {};
    const guestFromState = navState.guest;

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!Number.isNaN(id)) {
        this.isEdit = true;
        this.guestId = id;

        if (guestFromState && guestFromState.id === id) {
          // Prefill from navigation state; no HTTP request.
          const doc = new FormatDocumentPipe().transform(guestFromState.document);
          const phone = new FormatPhonePipe().transform(guestFromState.phone);
          this.form.patchValue({
            name: guestFromState.name || '',
            document: doc || '',
            phone: phone || '',
            hasCar: !!guestFromState.hasCar,
          });
        } else {
          // No state available (direct link/bookmark) -> fetch from API
          this.api.getGuest(id).subscribe({
            next: (g) => {
              const doc = new FormatDocumentPipe().transform(g.document);
              const phone = new FormatPhonePipe().transform(g.phone);
              this.form.patchValue({
                name: g.name || '',
                document: doc || '',
                phone: phone || '',
                hasCar: !!g.hasCar,
              });
            },
            error: () => {
              this.snack.open('Erro ao carregar hóspede para edição', 'Fechar', {
                duration: 4000,
              });
              this.router.navigate(['/hospedes']);
            },
          });
        }
      }
    }
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
    const obs = this.isEdit && this.guestId
      ? this.api.updateGuest(this.guestId, payload)
      : this.api.createGuest(payload);

    obs.subscribe({
      next: (resp) => {
        this.snack.open(
          this.isEdit ? 'Hóspede atualizado com sucesso' : 'Hóspede criado com sucesso',
          'Fechar',
          { duration: 3000 }
        );
        this.form.reset({ hasCar: false });
        this.router.navigate(['/hospedes']);
      },
      error: (err) => {
        const msg = err?.error?.message || (this.isEdit ? 'Erro ao atualizar hóspede' : 'Erro ao criar hóspede');
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
