import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstEntityMapComponent } from './mst-entity-map.component';

describe('MstEntityMapComponent', () => {
  let component: MstEntityMapComponent;
  let fixture: ComponentFixture<MstEntityMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstEntityMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstEntityMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
