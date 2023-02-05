import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtProceedingsComponent } from './court-proceedings.component';

describe('CourtProceedingsComponent', () => {
  let component: CourtProceedingsComponent;
  let fixture: ComponentFixture<CourtProceedingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourtProceedingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtProceedingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
