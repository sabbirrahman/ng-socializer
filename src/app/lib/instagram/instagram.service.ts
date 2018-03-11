// Imports from @angular
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
// Services
import { SocialService } from '../social/social.service';
// Interfaces, Utils & Declarations
import { SocializerMethod, SocialProfile } from '../socializer.interface';
import { asyncScriptLoad } from '../socializer.util';

export interface InstagramSDKConfig {
  clientId: string;
  redirectUri?: string;
}

@Injectable()
export class InstagramSocializer extends SocialService implements SocializerMethod {
  private config: InstagramSDKConfig;

  constructor(
    private http: HttpClient,
    private ngZone: NgZone
  ) {
    super();
  }

  init(config: InstagramSDKConfig, autoConnect = false): Observable<{ success: boolean }> {
    this._updateInitiationStatus(false, true);
    this.config = config;

    if (!config.clientId) {
      throw Error('You must provide a instagram clientId.');
    }

    if (!config.redirectUri) {
      this.config.redirectUri = window.location.origin + '/';
    }

    if (autoConnect) {
      return this.connect(true)
        .pipe(
          map(() => {
            return { success: true };
          })
        );
    }

    return of({ success: true });
  }

  connect(autoConnect = false): Observable<{ success: boolean }> {
    this._updateConnectionStatus(true, null);
    if (this.isSignedIn()) {
      return this._getProfile()
        .pipe(
          map((user) => {
            this._updateConnectionStatus(false, true);
            this._updateProfile(user);
            return { success: true };
          }),
          catchError(() => {
            localStorage.removeItem('instagramToken');
            this._updateConnectionStatus(false, true);
            return of({ success: false });
          })
        );
    } else if (!autoConnect) {
      return Observable.create((observer) => {
        // tslint:disable-next-line:max-line-length
        const url = `https://api.instagram.com/oauth/authorize/?client_id=${this.config.clientId}&redirect_uri=${this.config.redirectUri}&response_type=token`;
        const win = window.open(url, '', 'width=800,height=600');

        this.ngZone.runOutsideAngular(() => {
          const interval = setInterval(() => {
            try {
              if (/#access_token=/.test(win.location.hash)) {
                clearInterval(interval);
                const token = win.location.hash.replace('#access_token=', '');
                win.close();
                localStorage.setItem('instagramToken', token);
                this._getProfile()
                    .subscribe((user) => {
                      this.ngZone.runTask(() => {
                        this._updateConnectionStatus(false, true);
                        this._updateProfile(user);
                      });
                      observer.next({ success: true });
                      observer.complete();
                    });
              } else if (/error/.test(win.location.href)) {
                this.ngZone.runTask(() => {
                  this._updateConnectionStatus(false, false);
                });
                clearInterval(interval);
                win.close();
                observer.next({ success: false });
                observer.complete();
              }
            } catch (err) { }
          }, 1);
        });
      });
    } else {
      this._updateConnectionStatus(false, false);
      return of({ success: true });
    }
  }

  disconnect(): Observable<{ success: boolean }> {
    try {
      localStorage.removeItem('instagramToken');
      this._updateConnectionStatus(false, false);
      this._updateProfile();
      return of({ success: true });
    } catch (e) {
      return of({ success: false });
    }
  }

  isSignedIn() {
    return localStorage.getItem('instagramToken') ? true : false;
  }

  private _getProfile(): Observable<SocialProfile> {
    const token = localStorage.getItem('instagramToken');
    return this.http
      .get(`https://api.instagram.com/v1/users/self/?access_token=${token}`)
      .pipe(
        map((u: any) => {
          const user: SocialProfile = {
            id: u.data.id,
            fullName: u.data.full_name,
            firstName: u.data.first_name || u.data.full_name.split(' ')[0] || '',
            lastName: u.data.first_name || u.data.full_name.split(' ')[1] || '',
            email: '',
            username: `${u.data.username}` || '',
            link: `https://instagram.com/${u.data.username}` || '',
            image: u.data.profile_picture || '',
          };

          Object.defineProperty(user, 'original', { enumerable: false, writable: true });
          user.original = u;

          return user;
        })
      );
  }

}
