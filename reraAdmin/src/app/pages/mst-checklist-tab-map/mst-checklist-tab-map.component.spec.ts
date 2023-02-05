import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstChecklistTabMapComponent } from './mst-checklist-tab-map.component';

describe('MstChecklistTabMapComponent', () => {
  let component: MstChecklistTabMapComponent;
  let fixture: ComponentFixture<MstChecklistTabMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstChecklistTabMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstChecklistTabMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
