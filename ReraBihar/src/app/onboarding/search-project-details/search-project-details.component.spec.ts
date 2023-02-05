import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProjectDetailsComponent } from './search-project-details.component';

describe('SearchProjectDetailsComponent', () => {
  let component: SearchProjectDetailsComponent;
  let fixture: ComponentFixture<SearchProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchProjectDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
