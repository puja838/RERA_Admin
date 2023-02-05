import { TestBed } from '@angular/core/testing';

import { MstEntityTypeService } from './mst-entity-type.service';

describe('MstEntityTypeService', () => {
  let service: MstEntityTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MstEntityTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
