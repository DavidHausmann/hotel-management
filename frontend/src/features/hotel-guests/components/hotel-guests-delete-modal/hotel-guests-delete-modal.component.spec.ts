import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelGuestsDeleteModalComponent } from './hotel-guests-delete-modal.component';

describe('HotelGuestsDeleteModalComponent', () => {
  let component: HotelGuestsDeleteModalComponent;
  let fixture: ComponentFixture<HotelGuestsDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelGuestsDeleteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelGuestsDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
