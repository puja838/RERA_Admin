import { TestBed } from '@angular/core/testing';

import { MstFileVerifyService } from './mst-file-verify.service';

describe('MstFileVerifyService', () => {
  let service: MstFileVerifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MstFileVerifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
