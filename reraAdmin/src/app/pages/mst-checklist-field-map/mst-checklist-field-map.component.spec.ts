import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstChecklistFieldMapComponent } from './mst-checklist-field-map.component';

describe('MstChecklistFieldMapComponent', () => {
  let component: MstChecklistFieldMapComponent;
  let fixture: ComponentFixture<MstChecklistFieldMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstChecklistFieldMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstChecklistFieldMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
