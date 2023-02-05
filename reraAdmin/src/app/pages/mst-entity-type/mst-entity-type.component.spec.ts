import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstEntityTypeComponent } from './mst-entity-type.component';

describe('MstEntityTypeComponent', () => {
  let component: MstEntityTypeComponent;
  let fixture: ComponentFixture<MstEntityTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstEntityTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstEntityTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
