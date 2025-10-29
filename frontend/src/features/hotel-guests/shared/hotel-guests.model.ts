export interface HotelGuest {
  id: number;
  name: string;
  document: string;
  phone: string;
  hasCar: boolean;
}

export interface HotelGuestPage {
  items: HotelGuest[];
  pagination: {
    total: number;
    totalPages: number;
    pageSize: number;
    pageNumber: number;
  };
}

export interface HotelGuestFilters {
  name?: string;
  document?: string;
  phone?: string;
  inHotel?: boolean | null;
  reserved?: boolean | null;
}

export interface HotelGuestResponse {
  id: number;
  name: string;
  document: string;
  phone: string;
  hasCar: boolean;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}