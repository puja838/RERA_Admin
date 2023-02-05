import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByAuthorityInterimComponent } from './by-authority-interim.component';

describe('ByAuthorityInterimComponent', () => {
  let component: ByAuthorityInterimComponent;
  let fixture: ComponentFixture<ByAuthorityInterimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByAuthorityInterimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByAuthorityInterimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
