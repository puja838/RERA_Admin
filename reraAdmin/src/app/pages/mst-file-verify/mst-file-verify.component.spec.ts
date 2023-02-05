import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstFileVerifyComponent } from './mst-file-verify.component';

describe('MstFileVerifyComponent', () => {
  let component: MstFileVerifyComponent;
  let fixture: ComponentFixture<MstFileVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstFileVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstFileVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
