import { TestBed } from '@angular/core/testing';

import { MstEntityService } from './mst-entity.service';

describe('MstEntityService', () => {
  let service: MstEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MstEntityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
