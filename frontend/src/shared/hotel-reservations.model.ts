export interface ReservationResponse {
  id: number;
  checkinTime?: string;
  checkoutTime?: string;
  status?: 'CHECKED_IN' | 'CHECKED_OUT' | 'RESERVED';
  totalAmount?: number;
  hotelGuestId?: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  numberOfGuests?: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
