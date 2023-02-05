import { TestBed } from '@angular/core/testing';

import { PromoterWorkflowService } from './promoter-workflow.service';

describe('PromoterWorkflowService', () => {
  let service: PromoterWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromoterWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
