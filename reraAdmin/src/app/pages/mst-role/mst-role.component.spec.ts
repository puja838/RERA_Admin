import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstRoleComponent } from './mst-role.component';

describe('MstRoleComponent', () => {
  let component: MstRoleComponent;
  let fixture: ComponentFixture<MstRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
