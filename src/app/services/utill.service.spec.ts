import { TestBed } from '@angular/core/testing';

import { UtillService } from './utill.service';

describe('UtillService', () => {
  let service: UtillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
