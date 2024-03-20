import { TestBed } from '@angular/core/testing';

import { AuthownerGuard } from './authowner.guard';

describe('AuthownerGuard', () => {
  let guard: AuthownerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthownerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
