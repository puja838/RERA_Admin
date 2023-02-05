import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstWorkflowComponent } from './mst-workflow.component';

describe('MstWorkflowComponent', () => {
  let component: MstWorkflowComponent;
  let fixture: ComponentFixture<MstWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
