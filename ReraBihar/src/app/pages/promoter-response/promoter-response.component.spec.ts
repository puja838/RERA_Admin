import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoterResponseComponent } from './promoter-response.component';

describe('PromoterResponseComponent', () => {
  let component: PromoterResponseComponent;
  let fixture: ComponentFixture<PromoterResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromoterResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoterResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
