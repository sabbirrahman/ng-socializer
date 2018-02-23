// Imports from @angular
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
// Services
import { SocialService } from '../social/social.service';
import { fromPromise } from 'rxjs/observable/fromPromise';
// Interfaces, Utils & Declarations
import { SocializerMethod, SocialProfile } from '../socializer.interface';
import { asyncScriptLoad } from '../socializer.util';
import { switchMap, first, catchError } from 'rxjs/operators';
import { Observer } from 'rxjs/Observer';
import { map } from 'rxjs/operators/map';
declare const gapi: any;

interface GoogleSDKConfig {
  clientId: string;
  apiKey?: string;
  scope?: string;
  discoveryDocs?: Array<string>;
}

@Injectable()
export class GoogleSocializer extends SocialService implements SocializerMethod {
  private static readonly SDK_URL = 'https://apis.google.com/js/api.js';
  private GoogleAuth;

  constructor(
    private ngZone: NgZone
  ) {
    super();
  }

  init(config: GoogleSDKConfig, autoConnect = false): Observable<{ success: boolean }> {
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

        // Not Initialized Yet So Initiating
        if (!config.clientId) {
          throw Error('You must provide a google clientId.');
        }

        this._updateInitiationStatus(true, null);

        return asyncScriptLoad('google-jssdk', GoogleSocializer.SDK_URL)
          .pipe(
            switchMap(() => {
              return Observable.create((observer: Observer<{ success: boolean }>) => {
                gapi.load('client:auth2', () => {
                  gapi.auth2
                    .init({
                      clientId: config.clientId,
                      apiKey: config.apiKey || null,
                      scope: config.scope || null,
                      discoveryDocs: config.discoveryDocs || null
                    })
                    .then(() => {
                      this.GoogleAuth = gapi.auth2.getAuthInstance();

                      this._updateInitiationStatus(false, true);
                      !autoConnect ? observer.next({ success: true })
                        : this.connect(true).subscribe(
                          (res) => observer.next(res),
                          (err) => observer.error(err));
                      observer.complete();
                    });
                });
              });
            })
          );
      }));
  }

  connect(autoConnect = false): Observable<{ success: boolean }> {
    this._updateConnectionStatus(true, null);
    if (this.GoogleAuth && !this.GoogleAuth.isSignedIn.get() && !autoConnect) {
      return fromPromise(this.GoogleAuth.signIn())
        .pipe(
          map(() => {
            this.ngZone.runTask(() => {
              this._updateProfile(this._getProfile());
              this._updateConnectionStatus(false, true);
            });
            return { success: true };
          }),
          catchError(() => {
            this.ngZone.runTask(() => {
              this._updateProfile();
              this._updateConnectionStatus(false, false);
            });
            return of({ success: false });
          })
        );
    } else if (this.GoogleAuth && this.GoogleAuth.isSignedIn.get()) {
      this._updateProfile(this._getProfile());
      this._updateConnectionStatus(false, true);
      return of({ success: true });
    } else {
      this._updateProfile();
      this._updateConnectionStatus(false, false);
      return of({ success: false });
    }
  }

  disconnect(): Observable<{ success: boolean }> {
    this._updateConnectionStatus(true, null);
    return fromPromise(this.GoogleAuth.disconnect())
      .pipe(
        map(() => {
          this.ngZone.runTask(() => {
            this._updateProfile();
            this._updateConnectionStatus(false, false);
          });
          return { success: true };
        }),
        catchError(() => {
          this.ngZone.runTask(() => {
            this._updateConnectionStatus(false, false);
          });
          return of({ success: false });
        })
      );
  }

  private _getProfile(): SocialProfile {
    const info = this.GoogleAuth.currentUser.get().getBasicProfile();
    const user: SocialProfile = {
      id: info.getId() || '',
      fullName: info.getName() || '',
      firstName: info.getGivenName() || '',
      lastName: info.getFamilyName() || '',
      username: '',
      email: info.getEmail() || '',
      link: `https://plus.google.com/${info.getId()}`,
      image: info.getImageUrl() || '',
    };

    Object.defineProperty(user, 'original', { enumerable: false, writable: true });
    user.original = info;

    return user;
  }

  isSignedIn() {
    return this.GoogleAuth.isSignedIn.get();
  }
}
