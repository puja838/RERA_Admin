import { TestBed } from '@angular/core/testing';

import { EntityTypeStepFieldsService } from './entity-type-step-fields.service';

describe('EntityTypeStepFieldsService', () => {
  let service: EntityTypeStepFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityTypeStepFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
