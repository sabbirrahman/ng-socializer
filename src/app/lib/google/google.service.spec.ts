import { TestBed, inject } from '@angular/core/testing';

import { GoogleSocializer } from './google.service';

describe('GoogleSocializer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleSocializer]
    });
  });

  it('should be created', inject([GoogleSocializer], (service: GoogleSocializer) => {
    expect(service).toBeTruthy();
  }));
});
