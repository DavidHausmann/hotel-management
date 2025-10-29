import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, BehaviorSubject } from 'rxjs';

import { HomePageComponent } from './home-page.component';
import { HomePageService } from '../../services/application/home-page.service';
import { DashboardResponse } from '../../models/dashboard.model';

describe('HomePageComponent (integration)', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let component: HomePageComponent;
  const mock: DashboardResponse = {
    totalReservations: 8,
    totalActiveCheckins: 3,
    totalCurrentGuests: 10,
    totalCurrentCars: 2
  };

  const stubHomePageService = {
    dashboard$: of(mock),
    loadDashboard: () => of(mock),
    getDashboardSnapshot: () => mock
  } as Partial<HomePageService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [{ provide: HomePageService, useValue: stubHomePageService }]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('renders the metric texts inside home-chart components', () => {
    const texts = fixture.debugElement.queryAll(By.css('.home__chart__content__text'));
    expect(texts.length).toBeGreaterThanOrEqual(4);

    expect(texts[0].nativeElement.textContent.trim()).toBe(component.getTotalReservationsContent());
    expect(texts[1].nativeElement.textContent.trim()).toBe(component.getTotalActiveCheckinsContent());
    expect(texts[2].nativeElement.textContent.trim()).toBe(component.getTotalCurrentGuestsContent());
    expect(texts[3].nativeElement.textContent.trim()).toBe(component.getTotalCurrentCarsContent());
  });

  it('shows loading text while dashboard is delayed and updates when data arrives', async () => {
    const subject = new BehaviorSubject<DashboardResponse | null>(null);
    const delayedStub = {
      dashboard$: subject.asObservable(),
      loadDashboard: () => subject.asObservable(),
      getDashboardSnapshot: () => subject.getValue()
    } as Partial<HomePageService>;

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [{ provide: HomePageService, useValue: delayedStub }]
    }).compileComponents();

    const f = TestBed.createComponent(HomePageComponent);
    f.detectChanges();

    const firstText = f.debugElement.queryAll(By.css('.home__chart__content__text'))[0];
    expect(firstText.nativeElement.textContent.trim()).toBe('Carregando...');

    subject.next(mock);
    f.detectChanges();

    const updatedText = f.debugElement.queryAll(By.css('.home__chart__content__text'))[0];
    expect(updatedText.nativeElement.textContent.trim()).toBe('8 reservas');
  });
});
