import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstWorkflowStepsRoleComponent } from './mst-workflow-steps-role.component';

describe('MstWorkflowStepsRoleComponent', () => {
  let component: MstWorkflowStepsRoleComponent;
  let fixture: ComponentFixture<MstWorkflowStepsRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstWorkflowStepsRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstWorkflowStepsRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
