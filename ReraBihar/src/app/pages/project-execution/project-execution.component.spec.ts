import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectExecutionComponent } from './project-execution.component';

describe('ProjectExecutionComponent', () => {
  let component: ProjectExecutionComponent;
  let fixture: ComponentFixture<ProjectExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectExecutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
