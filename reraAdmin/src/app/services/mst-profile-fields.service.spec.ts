import { TestBed } from '@angular/core/testing';

import { MstProfileFieldsService } from './mst-profile-fields.service';

describe('MstProfileFieldsService', () => {
  let service: MstProfileFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MstProfileFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
