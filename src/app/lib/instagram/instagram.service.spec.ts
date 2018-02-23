import { TestBed, inject } from '@angular/core/testing';

import { InstagramSocializer } from './instagram.service';

describe('InstagramSocializer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstagramSocializer]
    });
  });

  it('should be created', inject([InstagramSocializer], (service: InstagramSocializer) => {
    expect(service).toBeTruthy();
  }));
});
