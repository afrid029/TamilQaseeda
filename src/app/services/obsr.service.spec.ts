import { TestBed } from '@angular/core/testing';

import { ObsrService } from './obsr.service';

describe('ObsrService', () => {
  let service: ObsrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObsrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
