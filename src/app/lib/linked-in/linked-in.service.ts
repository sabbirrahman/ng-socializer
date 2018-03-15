// Imports from @angular
import { Injectable, NgZone } from '@angular/core';
// RxJS
import { switchMap, first } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { of } from 'rxjs/observable/of';
// Services
import { SocialService } from '../social/social.service';
// Interfaces, Utils & Declarations
import { SocializerMethod, SocialProfile } from '../socializer.interface';
// import { asyncScriptLoad } from '../socializer.util';
declare const IN: any;

export interface LinkedInSDKConfig {
  api_key?: string;
  onLoad?: Function;
  authorize?: boolean;
  lang?: string;
}

@Injectable()
export class LinkedInSocializer extends SocialService implements SocializerMethod {
  private static readonly SDK_URL = 'https://platform.linkedin.com/in.js';

  constructor(
    private ngZone: NgZone
  ) {
    super();
  }

  init(config: LinkedInSDKConfig, autoConnect = false): Observable<{ success: boolean }> {
    return this.loaded$
      .pipe(
        first(),
        switchMap((loaded) => {
          // Already Initialized So No Need to Initialized Again
          if (loaded && !autoConnect) {
            return of({ success: true });
          } else if (loaded && autoConnect) {
            return this.connect(true);
          }

          this._updateInitiationStatus(true, null);

          return Observable.create((observer: Observer<{ success: boolean }>) => {
            window['linkedInLoaded'] = () => {
              this._updateInitiationStatus(false, true);

              !autoConnect ? observer.next({ success: true })
                : this.connect(true).subscribe(
                  (res) => observer.next(res),
                  (err) => observer.error(err));
              observer.complete();
            };
          });
        })
      );
  }

  connect(autoConnect = false): Observable<{ success: boolean }> {
    this._updateConnectionStatus(true, null);

    return Observable.create((observer: Observer<{ success: boolean }>) => {
      this.ngZone.runTask(() => {
        if (!IN.User.isAuthorized() && !autoConnect) {

          IN.User.authorize(() => {
            this._getProfile().subscribe((profile) => {
              this._updateConnectionStatus(false, true);
              this._updateProfile(profile);
              observer.next({ success: true });
              observer.complete();
            });
          }, this);

        } else if (IN.User.isAuthorized() && autoConnect) {

          this._getProfile().subscribe((profile) => {
            this._updateConnectionStatus(false, true);
            this._updateProfile(profile);
            observer.next({ success: true });
            observer.complete();
          });

        } else {

          this._updateConnectionStatus(false, false);
          return of({ success: false });

        }
      });
    });
  }

  disconnect(): Observable<{ success: boolean }> {
    this._updateConnectionStatus(true, null);

    return Observable.create((observer: Observer<{ success: boolean }>) => {
      this.ngZone.runTask(() => {
        if (IN.User.isAuthorized()) {
          IN.User.logout(() => {
            this._updateConnectionStatus(false, false);
            this._updateProfile();

            observer.next({ success: true });
            observer.complete();
          });
        } else {
          observer.next({ success: false });
          observer.complete();
        }
      });
    });
  }

  private _getProfile(): Observable<SocialProfile> {
    return Observable.create((observer: Observer<SocialProfile>) => {
      IN.API.Raw('/people/~:(id,emailAddress,firstName,lastName,picture-url,public-profile-url)?format=json')
        .result((info) => {
          const username = info.publicProfileUrl && info.publicProfileUrl.split('/').pop();
          const user: SocialProfile = {
            id: info.id,
            email: info.emailAddress,
            firstName: info.firstName,
            lastName: info.lastName,
            fullName: `${info.firstName} ${info.lastName}`,
            link: info.publicProfileUrl,
            image: info.pictureUrl,
            username
          };

          Object.defineProperty(user, 'original', { enumerable: false, writable: true });
          user['lnId'] = info.id;
          user.original = info;

          observer.next(user);
          observer.complete();
        })
        .error((err) => {
          observer.error(err);
          observer.complete();
        });
    });
  }

  isSignedIn() {
    return IN.User.isAuthorized();
  }
}
