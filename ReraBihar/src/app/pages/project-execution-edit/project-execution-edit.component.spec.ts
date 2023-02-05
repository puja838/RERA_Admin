import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectExecutionEditComponent } from './project-execution-edit.component';

describe('ProjectExecutionEditComponent', () => {
  let component: ProjectExecutionEditComponent;
  let fixture: ComponentFixture<ProjectExecutionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectExecutionEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectExecutionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
