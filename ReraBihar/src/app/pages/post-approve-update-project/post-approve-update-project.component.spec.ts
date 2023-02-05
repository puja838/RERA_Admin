import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostApproveUpdateProjectComponent } from './post-approve-update-project.component';

describe('PostApproveUpdateProjectComponent', () => {
  let component: PostApproveUpdateProjectComponent;
  let fixture: ComponentFixture<PostApproveUpdateProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostApproveUpdateProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostApproveUpdateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
