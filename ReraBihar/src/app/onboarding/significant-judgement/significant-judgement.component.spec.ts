import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignificantJudgementComponent } from './significant-judgement.component';

describe('SignificantJudgementComponent', () => {
  let component: SignificantJudgementComponent;
  let fixture: ComponentFixture<SignificantJudgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignificantJudgementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignificantJudgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
