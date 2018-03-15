import { TestBed, inject } from '@angular/core/testing';

import { LinkedInSocializer } from './linked-in.service';

describe('LinkedInSocializer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LinkedInSocializer]
    });
  });

  it('should be created', inject([LinkedInSocializer], (service: LinkedInSocializer) => {
    expect(service).toBeTruthy();
  }));
});
