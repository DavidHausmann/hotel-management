import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HotelReservationCheckoutPreviewModalComponent } from './hotel-reservation-checkout-preview-modal.component';
import { HotelReservationsService } from '../../services/api/hotel-reservations.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

describe('HotelReservationCheckoutPreviewModalComponent', () => {
  let component: HotelReservationCheckoutPreviewModalComponent;
  let fixture: ComponentFixture<HotelReservationCheckoutPreviewModalComponent>;
  let mockApi: any;
  let dialogRefSpy: any;

    beforeEach(async () => {
      mockApi = {
        getCheckoutPreview: jasmine.createSpy('getCheckoutPreview'),
        checkout: jasmine.createSpy('checkout'),
      };

      (mockApi.getCheckoutPreview as any).and.returnValue(of({
        totalWeekdays: 0,
        totalWeekends: 0,
        parkingWeekdays: 0,
        parkingWeekends: 0,
        extraFees: 0,
        totalAmount: 0,
      }));
    
      dialogRefSpy = { close: jasmine.createSpy('close') };
    
      await TestBed.configureTestingModule({
        imports: [HotelReservationCheckoutPreviewModalComponent, MatSnackBarModule],
        providers: [
          { provide: HotelReservationsService, useValue: mockApi },
          { provide: MatDialogRef, useValue: dialogRefSpy },
          { provide: MAT_DIALOG_DATA, useValue: { id: 123 } },
        ],
      }).compileComponents();
    
      fixture = TestBed.createComponent(HotelReservationCheckoutPreviewModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should call checkout and close dialog on success', fakeAsync(() => {
      (mockApi.checkout as any).and.returnValue(of({ id: 123, status: 'CHECKED_OUT' }));
      component.checkoutLocal = '2025-10-29T11:00';
    
      component.onConfirm();
      tick();
    
      expect(mockApi.checkout).toHaveBeenCalledWith(123, '2025-10-29T11:00:00');
      expect(dialogRefSpy.close).toHaveBeenCalledWith({ confirmed: true });
    }));
  
    it('should show error snackbar and not close on failure', fakeAsync(() => {
      (mockApi.checkout as any).and.returnValue(throwError({ error: { message: 'fail' } }));
      component.checkoutLocal = '2025-10-29T11:00';
    
      component.onConfirm();
      tick();
    
      expect(mockApi.checkout).toHaveBeenCalledWith(123, '2025-10-29T11:00:00');
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    }));
});
