// Imports from @angular
import { Injectable } from '@angular/core';
// RxJS
import { first, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { of } from 'rxjs/observable/of';
// Service
import { SocialService } from '../social/social.service';
// Interfaces & Models
import { SocializerMethod, SocialProfile } from '../socializer.interface';
import { DEFAULT_SOCIAL_PROFILE } from '../socializer.model';
// Utils
import { asyncScriptLoad } from '../socializer.util';
// Declarations
declare const FB: any;

interface FacebookSDKConfig {
  appId: number | string;
  scope?: string;
  field?: string;
  cookie?: boolean;
  xfbml?: boolean;
  version?: boolean;
}

@Injectable()
export class FacebookSocializer extends SocialService implements SocializerMethod {
  private static readonly SDK_URL = 'https://connect.facebook.net/en_US/sdk.js';
  private _scope = 'email';
  private _field = 'id,name,first_name,last_name,email,link,picture';

  init(config: FacebookSDKConfig, autoConnect = false): Observable<{ success: boolean }> {
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
          throw Error('You must provide a facebook app id.');
        }

        this._updateInitiationStatus(true, null);

        this._scope = config.scope ? config.scope : this._scope;
        this._field = config.field ? config.field : this._field;

        return asyncScriptLoad('facebook-jssdk', FacebookSocializer.SDK_URL)
            .pipe(
              switchMap(() => {
                FB.init({
                  appId      : config.appId,
                  cookie     : config.cookie || true,
                  xfbml      : config.xfbml || true,
                  version    : config.version || 'v2.9'
                });

                this._updateInitiationStatus(false, true);

                if (!autoConnect) {
                  return of({ success: true });
                } else {
                  return this.connect(true);
                }
              })
            );
      })
    );
  }

  connect(autoConnect = false): Observable<{ success: boolean }> {
    this._updateConnectionStatus(true, null);
    return Observable.create((observer: Observer<{ success: boolean }>) => {
      FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
          this._connectSuccess(observer);
        } else {
          if (!autoConnect) {
            FB.login((res) => {
              res.authResponse ? this._connectSuccess(observer) : this._connectFail(observer);
            }, { scope: this._scope });
          } else {
            this._connectFail(observer);
          }
        }
      });
    });
  }

  disconnect(): Observable<{ success: boolean }> {
    this._updateConnectionStatus(true, null);
    return Observable.create((observer: Observer<{ success: boolean }>) => {
      FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
          FB.logout();
          FB.api('/me/permissions', 'delete', res => {
            res.success ? observer.next({ success: true }) : observer.next({ success: false });
            this._updateConnectionStatus(false, false);
            this._updateProfile();
            observer.complete();
          });
        }
      });
    });
  }

  api(url, method = 'GET', options = {}): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      FB.api(url, method, options, (response) => {
        if (response && !response.error) {
          observer.next(response);
        } else {
          observer.error(response.error);
        }
        observer.complete();
      });
    });
  }

  private _connectSuccess(connectObserver: Observer<{ success: boolean }>): void {
    FB.api('/me', { fields: this._field }, (info) => {
      const user: SocialProfile = {
        id: info.id || '',
        fullName: info.name || '',
        firstName: info.first_name || '',
        lastName: info.last_name || '',
        username: '',
        email: info.email || '',
        link: info.link || '',
        image: info.picture && info.picture.data && info.picture.data.url || ''
      };

      Object.defineProperty(user, 'original', { enumerable: false, writable: true });
      user.original = info;

      this._updateConnectionStatus(false, true);
      this._updateProfile(user);
      connectObserver.next({ success: true });
      connectObserver.complete();
    });
  }

  private _connectFail(connectObserver: Observer<{ success: boolean }>): void {
    this._updateConnectionStatus(false, false);
    connectObserver.next({ success: false });
    connectObserver.complete();
  }
}
