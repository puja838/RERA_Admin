import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoterQueryDashboardComponent } from './promoter-query-dashboard.component';

describe('PromoterQueryDashboardComponent', () => {
  let component: PromoterQueryDashboardComponent;
  let fixture: ComponentFixture<PromoterQueryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromoterQueryDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoterQueryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
