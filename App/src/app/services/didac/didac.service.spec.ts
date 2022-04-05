import { TestBed } from '@angular/core/testing';

import { DidacService } from './didac.service';

describe('DidacService', () => {
  let service: DidacService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DidacService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
