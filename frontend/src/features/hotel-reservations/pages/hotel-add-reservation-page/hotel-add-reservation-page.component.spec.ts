import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelAddReservationPageComponent } from './hotel-add-reservation-page.component';

describe('HotelAddReservationPageComponent', () => {
  let component: HotelAddReservationPageComponent;
  let fixture: ComponentFixture<HotelAddReservationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelAddReservationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelAddReservationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
