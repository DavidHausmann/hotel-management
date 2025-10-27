import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelGuestsComponent } from './hotel-guests.component';

describe('HotelGuestsComponent', () => {
  let component: HotelGuestsComponent;
  let fixture: ComponentFixture<HotelGuestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelGuestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelGuestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
