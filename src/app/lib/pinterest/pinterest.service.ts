// Imports from @angular
import { Injectable } from '@angular/core';
// RxJS
import { map, first, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { of } from 'rxjs/observable/of';
// Service
import { SocialService } from '../social/social.service';
// Interfaces, Utils & Declarations
import { SocializerMethod, SocialProfile } from '../socializer.interface';
import { asyncScriptLoad } from '../socializer.util';
declare const PDK: any;

interface PinterestSDKConfig {
  appId: string;
  cookie?: boolean;
}

@Injectable()
export class PinterestSocializer extends SocialService implements SocializerMethod {
  private static readonly SDK_URL = 'https://assets.pinterest.com/sdk/sdk.js';

  init(config: PinterestSDKConfig, autoConnect = false): Observable<{ success: boolean }> {

    return this.loaded$.pipe(
      first(),
      switchMap((loaded) => {
        // Already Initialized So No Need to Initialized Again
        if (loaded && !autoConnect) {
          return of({ success: true });
        } else if (loaded && autoConnect) {
          return this.connect(true);
        }

        // Not Initialized Yet So Initiating
        if (!config.appId) {
          throw Error('You must provide a pinterest app id.');
        }

        this._updateInitiationStatus(true, null);

        return asyncScriptLoad('pinterest-jssdk', PinterestSocializer.SDK_URL)
          .pipe(
            switchMap(() => {
              PDK.init({
                appId: config.appId,
                cookie: config.cookie || true
              });

              this._updateInitiationStatus(false, true);
              return !autoConnect ? of({ success: true }) : this.connect(true);
            })
          );
      })
    );
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
          })
        );
    } else if (!autoConnect) {
      return Observable.create((observer: Observer<{ success: boolean }>) => {
        PDK.login({ scope: 'read_public'}, (res) => {
          this._getProfile().subscribe(user => {
            this._updateConnectionStatus(false, true);
            this._updateProfile(user);
            observer.next({ success: true });
            observer.complete();
          });
        });
      });
    } else {
      this._updateConnectionStatus(false, false);
      return of({ success: false });
    }
  }

  disconnect(): Observable<{ success: boolean }> {
    this._updateConnectionStatus(true, null);
    return Observable.create((observer) => {
      PDK.logout(() => {
        this._updateConnectionStatus(false, false);
        this._updateProfile();
        observer.next({ success: true });
        observer.complete();
      });
    });
  }

  isSignedIn() {
    return PDK.getSession();
  }

  private _getProfile(): Observable<SocialProfile> {
    return Observable.create((observer: Observer<SocialProfile>) => {
      const params = { fields: 'id,username,first_name,last_name,url,image' };
      PDK.request('/v1/me/', params, (res) => {
        if (!res || res.error) {
          observer.next(null);
          observer.complete();
        }
        const user: SocialProfile = {
          id: res.data.id || '',
          fullName: `${res.data.first_name} ${res.data.last_name}` || '',
          firstName: res.data.first_name || '',
          lastName: res.data.last_name || '',
          email: '',
          username: `${res.data.username}` || '',
          link: res.data.url || '',
          image: res.data.image['60x60'].url || ''
        };

        Object.defineProperty(user, 'original', { enumerable: false, writable: true });
        user.original = res;

        observer.next(user);
        observer.complete();
      });
    });
  }

}
