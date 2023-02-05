import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstChecklistTabMasterComponent } from './mst-checklist-tab-master.component';

describe('MstChecklistTabMasterComponent', () => {
  let component: MstChecklistTabMasterComponent;
  let fixture: ComponentFixture<MstChecklistTabMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstChecklistTabMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstChecklistTabMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
