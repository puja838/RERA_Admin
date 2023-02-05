import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauseListComponent } from './cause-list.component';

describe('CauseListComponent', () => {
  let component: CauseListComponent;
  let fixture: ComponentFixture<CauseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CauseListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CauseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
