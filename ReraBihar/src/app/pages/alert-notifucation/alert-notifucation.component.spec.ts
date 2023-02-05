import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertNotifucationComponent } from './alert-notifucation.component';

describe('AlertNotifucationComponent', () => {
  let component: AlertNotifucationComponent;
  let fixture: ComponentFixture<AlertNotifucationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertNotifucationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertNotifucationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
