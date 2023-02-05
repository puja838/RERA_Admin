import { TestBed } from '@angular/core/testing';

import { MstChecklistFieldMapService } from './mst-checklist-field-map.service';

describe('MstChecklistFieldMapService', () => {
  let service: MstChecklistFieldMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MstChecklistFieldMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
