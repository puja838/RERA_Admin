import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectExtensionDtlComponent } from './project-extension-dtl.component';

describe('ProjectExtensionDtlComponent', () => {
  let component: ProjectExtensionDtlComponent;
  let fixture: ComponentFixture<ProjectExtensionDtlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectExtensionDtlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectExtensionDtlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
