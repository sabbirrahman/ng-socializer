// Imports from @angular
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
// Services
import { FacebookSocializer } from './facebook/facebook.service';

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
        FacebookSocializer
      ]
    };
  }
}
