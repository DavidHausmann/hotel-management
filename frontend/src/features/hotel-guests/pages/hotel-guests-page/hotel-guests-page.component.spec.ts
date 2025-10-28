import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelGuestsPageComponent } from './hotel-guests-page.component';

describe('HotelGuestsPageComponent', () => {
  let component: HotelGuestsPageComponent;
  let fixture: ComponentFixture<HotelGuestsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelGuestsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelGuestsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
