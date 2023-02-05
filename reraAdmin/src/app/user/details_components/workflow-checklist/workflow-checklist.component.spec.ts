import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowChecklistComponent } from './workflow-checklist.component';

describe('WorkflowChecklistComponent', () => {
  let component: WorkflowChecklistComponent;
  let fixture: ComponentFixture<WorkflowChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
