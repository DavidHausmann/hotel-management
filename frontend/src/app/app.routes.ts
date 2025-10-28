import { Routes } from '@angular/router';

export const routes: Routes = [
//   { path: '', redirectTo: 'home', pathMatch: 'full' },
//   { path: '**', redirectTo: 'home' },
  {
    path: 'home',
    loadComponent: () =>
      import('../features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'hospedes',
    loadComponent: () =>
      import(
        '../features/hotel-guests/pages/hotel-guests-page/hotel-guests-page.component'
      ).then((m) => m.HotelGuestsPageComponent),
  },
  {
    path: 'reservas',
    loadComponent: () =>
      import(
        '../features/hotel-reservations/pages/hotel-reservations-page/hotel-reservations-page.component'
      ).then((m) => m.HotelReservationsPageComponent),
  },
];
