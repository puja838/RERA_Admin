import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationApplicationComponent } from './registration-application.component';

describe('RegistrationApplicationComponent', () => {
  let component: RegistrationApplicationComponent;
  let fixture: ComponentFixture<RegistrationApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
