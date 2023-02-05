import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstBusinessUnitTypeComponent } from './mst-business-unit-type.component';

describe('MstBusinessUnitTypeComponent', () => {
  let component: MstBusinessUnitTypeComponent;
  let fixture: ComponentFixture<MstBusinessUnitTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstBusinessUnitTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstBusinessUnitTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
