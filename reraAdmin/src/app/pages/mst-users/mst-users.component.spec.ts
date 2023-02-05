import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstUsersComponent } from './mst-users.component';

describe('MstUsersComponent', () => {
  let component: MstUsersComponent;
  let fixture: ComponentFixture<MstUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
