import { TestBed, inject } from '@angular/core/testing';

import { PinterestSocializer } from './pinterest.service';

describe('PinterestSocializer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PinterestSocializer]
    });
  });

  it('should be created', inject([PinterestSocializer], (service: PinterestSocializer) => {
    expect(service).toBeTruthy();
  }));
});
