import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstProfileStepFieldsComponent } from './mst-profile-step-fields.component';

describe('MstProfileStepFieldsComponent', () => {
  let component: MstProfileStepFieldsComponent;
  let fixture: ComponentFixture<MstProfileStepFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstProfileStepFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstProfileStepFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
