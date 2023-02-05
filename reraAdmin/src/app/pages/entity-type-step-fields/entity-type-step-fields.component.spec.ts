import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTypeStepFieldsComponent } from './entity-type-step-fields.component';

describe('EntityTypeStepFieldsComponent', () => {
  let component: EntityTypeStepFieldsComponent;
  let fixture: ComponentFixture<EntityTypeStepFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityTypeStepFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityTypeStepFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
