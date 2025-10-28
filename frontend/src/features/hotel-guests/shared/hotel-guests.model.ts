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