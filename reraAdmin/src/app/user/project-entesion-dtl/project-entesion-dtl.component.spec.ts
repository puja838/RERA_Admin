import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEntesionDtlComponent } from './project-entesion-dtl.component';

describe('ProjectEntesionDtlComponent', () => {
  let component: ProjectEntesionDtlComponent;
  let fixture: ComponentFixture<ProjectEntesionDtlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectEntesionDtlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEntesionDtlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
