// Imports from @angular
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
// Services
import { PinterestSocializer } from './pinterest/pinterest.service';
import { InstagramSocializer } from './instagram/instagram.service';
import { LinkedInSocializer } from './linked-in/linked-in.service';
import { FacebookSocializer } from './facebook/facebook.service';
import { GoogleSocializer } from './google/google.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class SocializerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SocializerModule,
      providers: [
        PinterestSocializer,
        InstagramSocializer,
        LinkedInSocializer,
        FacebookSocializer,
        GoogleSocializer
      ]
    };
  }
}
