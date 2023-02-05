import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstWorkflowStepsRoleUserComponent } from './mst-workflow-steps-role-user.component';

describe('MstWorkflowStepsRoleUserComponent', () => {
  let component: MstWorkflowStepsRoleUserComponent;
  let fixture: ComponentFixture<MstWorkflowStepsRoleUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstWorkflowStepsRoleUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstWorkflowStepsRoleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
