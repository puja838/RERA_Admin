import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstStepsWorksComponent } from './mst-steps-works.component';

describe('MstStepsWorksComponent', () => {
  let component: MstStepsWorksComponent;
  let fixture: ComponentFixture<MstStepsWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstStepsWorksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstStepsWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
