import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstEntityComponent } from './mst-entity.component';

describe('MstEntityComponent', () => {
  let component: MstEntityComponent;
  let fixture: ComponentFixture<MstEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
