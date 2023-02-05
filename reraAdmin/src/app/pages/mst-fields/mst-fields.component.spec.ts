import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstFieldsComponent } from './mst-fields.component';

describe('MstFieldsComponent', () => {
  let component: MstFieldsComponent;
  let fixture: ComponentFixture<MstFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
