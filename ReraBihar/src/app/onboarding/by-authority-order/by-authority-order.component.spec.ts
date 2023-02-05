import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByAuthorityOrderComponent } from './by-authority-order.component';

describe('ByAuthorityOrderComponent', () => {
  let component: ByAuthorityOrderComponent;
  let fixture: ComponentFixture<ByAuthorityOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByAuthorityOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByAuthorityOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
