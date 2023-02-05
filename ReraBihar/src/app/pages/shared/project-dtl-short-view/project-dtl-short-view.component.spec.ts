import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDtlShortViewComponent } from './project-dtl-short-view.component';

describe('ProjectDtlShortViewComponent', () => {
  let component: ProjectDtlShortViewComponent;
  let fixture: ComponentFixture<ProjectDtlShortViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDtlShortViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDtlShortViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
