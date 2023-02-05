import { TestBed } from '@angular/core/testing';

import { MstProfileFieldsGroupService } from './mst-profile-fields-group.service';

describe('MstProfileFieldsGroupService', () => {
  let service: MstProfileFieldsGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MstProfileFieldsGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
