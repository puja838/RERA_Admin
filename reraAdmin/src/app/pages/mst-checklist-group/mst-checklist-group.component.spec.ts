import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstChecklistGroupComponent } from './mst-checklist-group.component';

describe('MstChecklistGroupComponent', () => {
  let component: MstChecklistGroupComponent;
  let fixture: ComponentFixture<MstChecklistGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstChecklistGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstChecklistGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
