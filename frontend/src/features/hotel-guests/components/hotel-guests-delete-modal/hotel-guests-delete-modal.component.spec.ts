import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HotelGuestsDeleteModalComponent } from './hotel-guests-delete-modal.component';
import { HotelGuestsService } from '../../services/api/hotel-guests.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

describe('HotelGuestsDeleteModalComponent', () => {
  let component: HotelGuestsDeleteModalComponent;
  let fixture: ComponentFixture<HotelGuestsDeleteModalComponent>;

  beforeEach(async () => {
    const apiStub = { deleteGuest: jasmine.createSpy('deleteGuest').and.returnValue(of({})) };
    const snackStub = { open: jasmine.createSpy('open') };
    await TestBed.configureTestingModule({
      imports: [HotelGuestsDeleteModalComponent, BrowserAnimationsModule, MatDialogModule, MatButtonModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: HotelGuestsService, useValue: apiStub },
        { provide: MatSnackBar, useValue: snackStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelGuestsDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onCancel closes dialog with false', () => {
    const dialogRef = TestBed.inject(MatDialogRef) as any;
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('onConfirm without id shows snackbar and does not call API', () => {
    const api = TestBed.inject(HotelGuestsService) as any;
    const snackStub = { open: jasmine.createSpy('open') };
    
    (component as any).snackBar = snackStub;
    component.onConfirm();
    expect(api.deleteGuest).not.toHaveBeenCalled();
    expect(snackStub.open).toHaveBeenCalled();
  });

  it('onConfirm with id calls API, shows success and closes', () => {
    const api = TestBed.inject(HotelGuestsService) as any;
    const snackStub = { open: jasmine.createSpy('open') };
    const dialogRef = TestBed.inject(MatDialogRef) as any;
    (component as any).data = { id: 55 };
    
    (component as any).snackBar = snackStub;
    (component as any).api = api;
    (component as any).dialogRef = dialogRef;
    api.deleteGuest.and.returnValue(of({}));
    component.onConfirm();
    expect(api.deleteGuest).toHaveBeenCalledWith(55);
    expect(snackStub.open).toHaveBeenCalledWith('Hóspede excluído com sucesso.', undefined, { duration: 3000 });
    expect(dialogRef.close).toHaveBeenCalledWith(true);
    expect(component.loading).toBeFalse();
  });

  it('onConfirm shows error snackbar on API error and does not close', () => {
    const api = TestBed.inject(HotelGuestsService) as any;
    const snackStub = { open: jasmine.createSpy('open') };
    const dialogRef = TestBed.inject(MatDialogRef) as any;
    (component as any).data = { id: 66 };
    (component as any).snackBar = snackStub;
    (component as any).api = api;
    api.deleteGuest.and.returnValue(throwError(() => ({ status: 409 })));
    component.onConfirm();
    expect(api.deleteGuest).toHaveBeenCalledWith(66);
    expect(snackStub.open).toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalledWith(true);
    expect(component.loading).toBeFalse();
  });
});
