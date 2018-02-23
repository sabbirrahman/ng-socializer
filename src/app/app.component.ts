// Imports from @angular
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
// RxJS
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
// Services
import { InstagramSocializer } from './lib/instagram/instagram.service';
import { FacebookSocializer } from './lib/facebook/facebook.service';
import { GoogleSocializer } from './lib/google/google.service';
// Interfaces
import { SocialProfile, SocialPlatforms } from './lib/socializer.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  // Facebook
  facebookProfileInfo$: Observable<SocialProfile>;
  facebookConnected$: Observable<boolean>;
  facebookStatus$: Observable<number>;

  // Google
  googleProfileInfo$: Observable<SocialProfile>;
  googleConnected$: Observable<boolean>;
  googleStatus$: Observable<number>;

  // Instagram
  instagramProfileInfo$: Observable<SocialProfile>;
  instagramConnected$: Observable<boolean>;
  instagramStatus$: Observable<number>;

  constructor(
    private instagram: InstagramSocializer,
    private facebook: FacebookSocializer,
    private google: GoogleSocializer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Facebook
    this.facebook.init({ appId: 151369802157504 }, true).subscribe();
    this.facebookProfileInfo$ = this.facebook.profile$;
    this.facebookConnected$ = this.facebook.connected$;
    this.facebookStatus$ = this.facebook.status$;

    // Google
    this.google.init({
      clientId: '739422752724-6kh0s14d3pqs76b7e0c8qlckln16ufaf.apps.googleusercontent.com'
    }, true).subscribe();
    this.googleProfileInfo$ = this.google.profile$;
    this.googleConnected$ = this.google.connected$;
    this.googleStatus$ = this.google.status$;

    // Instagram
    this.instagram.init({ clienId: '667599dfbeb34e07b107161c6191dfe9' }, true).subscribe();
    this.instagramProfileInfo$ = this.instagram.profile$;
    this.instagramConnected$ = this.instagram.connected$;
    this.instagramStatus$ = this.instagram.status$;
  }

  connect(socialPlatforms: SocialPlatforms) {
    this[socialPlatforms].connect().subscribe();
  }

  disconnect(socialPlatforms: SocialPlatforms) {
    this[socialPlatforms].disconnect().subscribe();
  }
}
