import { TestBed, inject } from '@angular/core/testing';

import { FacebookSocializer } from './facebook.service';

describe('FacebookSocializer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacebookSocializer]
    });
  });

  it('should be created', inject([FacebookSocializer], (service: FacebookSocializer) => {
    expect(service).toBeTruthy();
  }));
});
