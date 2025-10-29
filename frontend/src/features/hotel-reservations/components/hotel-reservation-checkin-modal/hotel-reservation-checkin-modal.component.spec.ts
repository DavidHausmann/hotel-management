import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HotelReservationCheckinModalComponent } from './hotel-reservation-checkin-modal.component';
import { HotelReservationsService } from '../../services/api/hotel-reservations.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('HotelReservationCheckinModalComponent', () => {
  let component: HotelReservationCheckinModalComponent;
  let fixture: ComponentFixture<HotelReservationCheckinModalComponent>;
  let mockApi: any;

  beforeEach(async () => {
    mockApi = { checkin: jasmine.createSpy('checkin').and.returnValue(of({ id: 1, status: 'CHECKED_IN' })) };

    await TestBed.configureTestingModule({
      imports: [HotelReservationCheckinModalComponent, MatSnackBarModule],
      providers: [
        { provide: HotelReservationsService, useValue: mockApi },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: { id: 1 } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelReservationCheckinModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
