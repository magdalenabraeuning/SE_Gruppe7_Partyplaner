import { TestBed } from '@angular/core/testing';

import { SpeicherService } from './speicher.service';

describe('SpeicherService', () => {
  let service: SpeicherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeicherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
