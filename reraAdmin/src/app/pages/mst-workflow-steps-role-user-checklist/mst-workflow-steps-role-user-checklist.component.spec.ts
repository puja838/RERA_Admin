import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstWorkflowStepsRoleUserChecklistComponent } from './mst-workflow-steps-role-user-checklist.component';

describe('MstWorkflowStepsRoleUserChecklistComponent', () => {
  let component: MstWorkflowStepsRoleUserChecklistComponent;
  let fixture: ComponentFixture<MstWorkflowStepsRoleUserChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstWorkflowStepsRoleUserChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstWorkflowStepsRoleUserChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
