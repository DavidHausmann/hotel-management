import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HotelGuestsService } from './hotel-guests.service';
import { HttpTestingController } from '@angular/common/http/testing';

describe('HotelGuestsService', () => {
  let service: HotelGuestsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(HotelGuestsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call searchGuests with params and cap size at 30', () => {
    service.searchGuests({ name: 'Ana' }, 1, 50).subscribe();

  const req = httpMock.expectOne((r: any) => r.method === 'GET' && r.url === 'http://localhost:8080/api/guest/search');
    expect(req.request.params.get('page')).toEqual('1');
    
    expect(req.request.params.get('size')).toEqual('30');
    expect(req.request.params.get('name')).toEqual('Ana');
    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 30, number: 1 });
  });

  it('should include boolean params when provided and omit when null', () => {
    service.searchGuests({ inHotel: true, reserved: false }, 2, 10).subscribe();
    const req = httpMock.expectOne((r: any) => r.method === 'GET' && r.url === 'http://localhost:8080/api/guest/search');
    expect(req.request.params.get('page')).toEqual('2');
    expect(req.request.params.get('size')).toEqual('10');
    expect(req.request.params.get('inHotel')).toEqual('true');
    expect(req.request.params.get('reserved')).toEqual('false');
    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 10, number: 2 });

    
    service.searchGuests({ inHotel: null as any, reserved: null as any }, 0, 5).subscribe();
    const req2 = httpMock.expectOne((r: any) => r.method === 'GET' && r.url === 'http://localhost:8080/api/guest/search');
    expect(req2.request.params.get('inHotel')).toBeNull();
    expect(req2.request.params.get('reserved')).toBeNull();
    req2.flush({ content: [], totalElements: 0, totalPages: 0, size: 5, number: 0 });
  });

  it('should use default size 20 when size not provided', () => {
    
    service.searchGuests({}, 1).subscribe();
    const req = httpMock.expectOne((r: any) => r.method === 'GET' && r.url === 'http://localhost:8080/api/guest/search');
    expect(req.request.params.get('size')).toEqual('20');
    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 20, number: 1 });
  });

  it('should propagate http errors for getGuest', (done) => {
    service.getGuest(5).subscribe({
      next: () => fail('should not succeed'),
      error: (err) => {
        expect(err.status).toBe(500);
        done();
      }
    });
    const req = httpMock.expectOne('http://localhost:8080/api/guest/5');
    req.flush({ message: 'server' }, { status: 500, statusText: 'Server Error' });
  });

  it('should call deleteGuest and updateGuest with correct methods', () => {
    service.deleteGuest(7).subscribe();
    const delReq = httpMock.expectOne('http://localhost:8080/api/guest/7');
    expect(delReq.request.method).toBe('DELETE');
    delReq.flush(null);

    const payload = { name: 'Updated' };
    service.updateGuest(8, payload).subscribe((resp) => {
      expect(resp.name).toEqual('Updated');
    });
    const patchReq = httpMock.expectOne('http://localhost:8080/api/guest/8');
    expect(patchReq.request.method).toBe('PATCH');
    expect(patchReq.request.body).toEqual(payload);
    patchReq.flush({ id: 8, ...payload });
  });

  it('should POST createGuest with payload', () => {
    const payload = { name: 'João', document: '123.456.789-00', phone: '1199999', hasCar: true };
    service.createGuest(payload).subscribe((resp) => {
      expect(resp.name).toEqual('João');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/guest');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 1, ...payload });
  });

  afterEach(() => httpMock.verify());
});
