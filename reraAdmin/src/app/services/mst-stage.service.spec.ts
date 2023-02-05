import { TestBed } from '@angular/core/testing';

import { MstStageService } from './mst-stage.service';

describe('MstStageService', () => {
  let service: MstStageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MstStageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
