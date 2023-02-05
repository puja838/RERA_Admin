import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListDashboardComponent } from './project-list-dashboard.component';

describe('ProjectListDashboardComponent', () => {
  let component: ProjectListDashboardComponent;
  let fixture: ComponentFixture<ProjectListDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectListDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
