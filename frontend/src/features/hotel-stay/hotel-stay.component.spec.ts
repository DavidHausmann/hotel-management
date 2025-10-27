import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelStayComponent } from './hotel-stay.component';

describe('HotelStayComponent', () => {
  let component: HotelStayComponent;
  let fixture: ComponentFixture<HotelStayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelStayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelStayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
