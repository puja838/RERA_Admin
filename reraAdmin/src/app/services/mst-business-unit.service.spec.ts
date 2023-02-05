import { TestBed } from '@angular/core/testing';

import { MstBusinessUnitService } from './mst-business-unit.service';

describe('MstBusinessUnitService', () => {
  let service: MstBusinessUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MstBusinessUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
