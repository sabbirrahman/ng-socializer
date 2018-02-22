// Imports from @angular
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
// RxJS
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
// Services
import { FacebookSocializer } from './lib/facebook/facebook.service';
// Interfaces
import { SocialProfile } from './lib/socializer.interface';

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

  constructor(
    private facebook: FacebookSocializer
  ) {}

  ngOnInit() {
    // Facebook
    this.facebook.init({ appId: 151369802157504 }, true).subscribe();
    this.facebookProfileInfo$ = this.facebook.profile$;
    this.facebookConnected$ = this.facebook.connected$;
    this.facebookStatus$ = this.facebook.status$;
  }

  connect(socialNetwork: string) {
    switch (socialNetwork) {
      case 'facebook':
        this.facebook.connect().subscribe();
        break;
    }
  }

  disconnect(socialNetwork: string) {
    switch (socialNetwork) {
      case 'facebook':
        this.facebook.disconnect().subscribe();
        break;
    }
  }
}
