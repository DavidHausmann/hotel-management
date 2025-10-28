import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HotelGuestsService } from './hotel-guests.service';

describe('HotelGuestsService', () => {
  let service: HotelGuestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(HotelGuestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
