import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstWorkflowStepsWorksComponent } from './mst-workflow-steps-works.component';

describe('MstWorkflowStepsWorksComponent', () => {
  let component: MstWorkflowStepsWorksComponent;
  let fixture: ComponentFixture<MstWorkflowStepsWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstWorkflowStepsWorksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstWorkflowStepsWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
