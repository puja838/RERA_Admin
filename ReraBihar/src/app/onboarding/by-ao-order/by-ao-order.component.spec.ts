import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByAoOrderComponent } from './by-ao-order.component';

describe('ByAoOrderComponent', () => {
  let component: ByAoOrderComponent;
  let fixture: ComponentFixture<ByAoOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByAoOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByAoOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
