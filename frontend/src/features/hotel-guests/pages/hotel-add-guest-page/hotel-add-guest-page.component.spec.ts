import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelAddGuestPageComponent } from './hotel-add-guest-page.component';

describe('HotelAddGuestPageComponent', () => {
  let component: HotelAddGuestPageComponent;
  let fixture: ComponentFixture<HotelAddGuestPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelAddGuestPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelAddGuestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
