import { TestBed } from '@angular/core/testing';

import { MstProfileStepFieldsService } from './mst-profile-step-fields.service';

describe('MstProfileStepFieldsService', () => {
  let service: MstProfileStepFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MstProfileStepFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
