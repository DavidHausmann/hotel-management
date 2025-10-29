import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('../features/home/pages/home-page/home-page.component').then(
        (module) => module.HomePageComponent
      ),
  },
  {
    path: 'hospedes',
    loadComponent: () =>
      import(
        '../features/hotel-guests/pages/hotel-guests-page/hotel-guests-page.component'
      ).then((module) => module.HotelGuestsPageComponent),
  },
  {
    path: 'adicionar-hospede',
    loadComponent: () =>
      import(
        '../features/hotel-guests/pages/hotel-add-guest-page/hotel-add-guest-page.component'
      ).then((module) => module.HotelAddGuestPageComponent),
  },
  {
    path: 'adicionar-hospede/:id',
    loadComponent: () =>
      import(
        '../features/hotel-guests/pages/hotel-add-guest-page/hotel-add-guest-page.component'
      ).then((module) => module.HotelAddGuestPageComponent),
  },
  {
    path: 'reservas',
    loadComponent: () =>
      import(
        '../features/hotel-reservations/pages/hotel-reservations-page/hotel-reservations-page.component'
      ).then((module) => module.HotelReservationsPageComponent),
  },
  {
    path: 'reservas/adicionar/:hotelGuestId',
    loadComponent: () =>
      import(
        '../features/hotel-reservations/pages/hotel-add-reservation-page/hotel-add-reservation-page.component'
      ).then((module) => module.HotelAddReservationPageComponent),
  },
];
