// Imports from @angular
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Socializer Module
import { SocializerModule } from './lib/socializer.module';
// Demo Component
import { AppComponent } from './app.component';
import { SocialBoxComponent } from './social-box/social-box.component';

@NgModule({
  declarations: [AppComponent, SocialBoxComponent],
  bootstrap: [AppComponent],
  imports: [
    SocializerModule.forRoot(),
    HttpClientModule,
    BrowserModule
  ]
})
export class AppModule { }
