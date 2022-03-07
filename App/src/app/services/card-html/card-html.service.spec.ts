import { TestBed } from '@angular/core/testing';

import { CardHtmlService } from './card-html.service';

describe('CardHtmlService', () => {
  let service: CardHtmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardHtmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
