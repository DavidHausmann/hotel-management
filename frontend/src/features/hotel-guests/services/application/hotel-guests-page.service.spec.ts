import { TestBed } from '@angular/core/testing';

import { HotelGuestsPageService } from './hotel-guests-page.service';

describe('HotelGuestsPageService', () => {
  let service: HotelGuestsPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelGuestsPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
