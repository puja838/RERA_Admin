import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstStageComponent } from './mst-stage.component';

describe('MstStageComponent', () => {
  let component: MstStageComponent;
  let fixture: ComponentFixture<MstStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstStageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
