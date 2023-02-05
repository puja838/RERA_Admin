import { TestBed } from '@angular/core/testing';

import { AuthGuardAdminGuard } from './auth-guard-admin.guard';

describe('AuthGuardAdminGuard', () => {
  let guard: AuthGuardAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGuardAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
