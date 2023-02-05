import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectExtensionListComponent } from './project-extension-list.component';

describe('ProjectExtensionListComponent', () => {
  let component: ProjectExtensionListComponent;
  let fixture: ComponentFixture<ProjectExtensionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectExtensionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectExtensionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
