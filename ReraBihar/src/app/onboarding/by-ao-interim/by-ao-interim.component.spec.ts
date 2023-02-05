import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByAoInterimComponent } from './by-ao-interim.component';

describe('ByAoInterimComponent', () => {
  let component: ByAoInterimComponent;
  let fixture: ComponentFixture<ByAoInterimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByAoInterimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByAoInterimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
