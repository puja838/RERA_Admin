import { TestBed } from '@angular/core/testing';

import { MstFieldsService } from './mst-fields.service';

describe('MstFieldsService', () => {
  let service: MstFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MstFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
