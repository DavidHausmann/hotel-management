import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelReservationsPageComponent } from './hotel-reservations-page.component';

describe('HotelReservationsPageComponent', () => {
  let component: HotelReservationsPageComponent;
  let fixture: ComponentFixture<HotelReservationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelReservationsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelReservationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
