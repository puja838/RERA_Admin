import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstProfileFieldsComponent } from './mst-profile-fields.component';

describe('MstProfileFieldsComponent', () => {
  let component: MstProfileFieldsComponent;
  let fixture: ComponentFixture<MstProfileFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstProfileFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstProfileFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
