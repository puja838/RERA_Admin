import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstBusinessUnitComponent } from './mst-business-unit.component';

describe('MstBusinessUnitComponent', () => {
  let component: MstBusinessUnitComponent;
  let fixture: ComponentFixture<MstBusinessUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstBusinessUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstBusinessUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
