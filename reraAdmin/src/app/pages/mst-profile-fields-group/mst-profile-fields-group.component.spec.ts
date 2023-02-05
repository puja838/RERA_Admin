import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstProfileFieldsGroupComponent } from './mst-profile-fields-group.component';

describe('MstProfileFieldsGroupComponent', () => {
  let component: MstProfileFieldsGroupComponent;
  let fixture: ComponentFixture<MstProfileFieldsGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstProfileFieldsGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstProfileFieldsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
