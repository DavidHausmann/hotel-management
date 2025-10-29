import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeChartComponent } from './home-chart.component';

describe('HomeChartComponent', () => {
  let component: HomeChartComponent;
  let fixture: ComponentFixture<HomeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
