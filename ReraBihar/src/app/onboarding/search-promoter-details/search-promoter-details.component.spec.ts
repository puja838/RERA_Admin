import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPromoterDetailsComponent } from './search-promoter-details.component';

describe('SearchPromoterDetailsComponent', () => {
  let component: SearchPromoterDetailsComponent;
  let fixture: ComponentFixture<SearchPromoterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchPromoterDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPromoterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
