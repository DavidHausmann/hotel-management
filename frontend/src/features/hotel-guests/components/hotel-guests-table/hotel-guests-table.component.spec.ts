import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelGuestsTableComponent } from './hotel-guests-table.component';

describe('HotelGuestsTableComponent', () => {
  let component: HotelGuestsTableComponent;
  let fixture: ComponentFixture<HotelGuestsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelGuestsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelGuestsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
