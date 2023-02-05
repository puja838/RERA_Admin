import { TestBed } from '@angular/core/testing';

import { MstEntityMapService } from './mst-entity-map.service';

describe('MstEntityMapService', () => {
  let service: MstEntityMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MstEntityMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
