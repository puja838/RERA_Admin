import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstNoticeboardComponent } from './mst-noticeboard.component';

describe('MstNoticeboardComponent', () => {
  let component: MstNoticeboardComponent;
  let fixture: ComponentFixture<MstNoticeboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstNoticeboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstNoticeboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
