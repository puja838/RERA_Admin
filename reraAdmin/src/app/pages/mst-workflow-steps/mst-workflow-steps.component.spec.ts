import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstWorkflowStepsComponent } from './mst-workflow-steps.component';

describe('MstWorkflowStepsComponent', () => {
  let component: MstWorkflowStepsComponent;
  let fixture: ComponentFixture<MstWorkflowStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstWorkflowStepsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstWorkflowStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
