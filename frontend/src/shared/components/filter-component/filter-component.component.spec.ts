import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ThemeService } from '../../../core/services/theme/theme.service';

import { FilterComponent } from './filter-component.component';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  const themeMock = { isDarkMode: () => false } as Partial<ThemeService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterComponent],
      providers: [{ provide: ThemeService, useValue: themeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit applyFiltersEvent when applyFilters called', () => {
    const spy = spyOn(component.applyFiltersEvent, 'emit');
    component.applyFilters();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit clearFiltersEvent when clearFilters called', () => {
    const spy = spyOn(component.clearFiltersEvent, 'emit');
    component.clearFilters();
    expect(spy).toHaveBeenCalled();
  });

  it('should stop event propagation on click', () => {
    const stopSpy = jasmine.createSpy('stopPropagation');
    const fakeEvent: any = { stopPropagation: stopSpy };
    component.onClick(fakeEvent as Event);
    expect(stopSpy).toHaveBeenCalled();
  });

  it('startClose should emit closeEvent after timeout if animationend not fired', fakeAsync(() => {
    const spy = spyOn(component.closeEvent, 'emit');
    component.startClose();
    expect(component.isClosing).toBe(true);
    
    tick(350);
    expect(spy).toHaveBeenCalled();
    expect(component.isClosing).toBe(false);
  }));

  it('onAnimationEnd should emit closeEvent when closing', () => {
    const spy = spyOn(component.closeEvent, 'emit');
    component.isClosing = true;
    component.onAnimationEnd({} as AnimationEvent);
    expect(spy).toHaveBeenCalled();
    expect(component.isClosing).toBe(false);
  });
});
