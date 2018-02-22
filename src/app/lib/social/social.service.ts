// Imports from @angular
import { Injectable } from '@angular/core';
// RxJS
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
// Interfaces & Models
import { SocialProfile, SocializerStatus } from '../socializer.interface';
import { DEFAULT_SOCIAL_PROFILE } from '../socializer.model';

@Injectable()
export class SocialService {
  // Profile Observable
  profile$: Observable<SocialProfile>;

  // Status Observables
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  connecting$: Observable<boolean>;
  connected$: Observable<boolean>;
  status$: Observable<number>;

  // Observer
  protected _profileObserver$: Observer<SocialProfile>;
  protected _loadingObserver$: Observer<boolean>;
  protected _loadedObserver$: Observer<boolean>;
  protected _connectingObserver$: Observer<boolean>;
  protected _connectedObserver$: Observer<boolean>;
  protected _statusObserver$: Observer<number>;

  constructor() {
    this.profile$ = Observable.create((observer) => {
      this._profileObserver$ = observer;
      this._profileObserver$.next(DEFAULT_SOCIAL_PROFILE);
    });

    this.loading$ = Observable.create((observer) => {
      this._loadingObserver$ = observer;
      this._loadingObserver$.next(false);
    });

    this.loaded$ = Observable.create((observer) => {
    this._loadedObserver$ = observer;
      this._loadedObserver$.next(false);
    });

    this.connecting$ = Observable.create((observer) => {
      this._connectingObserver$ = observer;
      this._connectingObserver$.next(false);
    });

    this.connected$ = Observable.create((observer) => {
      this._connectedObserver$ = observer;
      this._connectedObserver$.next(false);
    });

    this.status$ = Observable.create((observer) => {
      this._statusObserver$ = observer;
      this._statusObserver$.next(SocializerStatus.NotLoaded);
    });
  }

  protected _updateInitiationStatus(loading: boolean, loaded: boolean) {
    // Update Loading Status
    if (this._loadingObserver$ && loading !== null) {
      this._loadingObserver$.next(loading);

      // All in One Status Updated
      if (loading && this._statusObserver$) { this._statusObserver$.next(SocializerStatus.Loading); }
    } else if (loading !== null) {
      this.loading$ = Observable.create((observer) => {
        this._loadingObserver$ = observer;
        this._loadingObserver$.next(loading);
      });

      // All in One Status Updated
      if (loading && this._statusObserver$) {
        this._statusObserver$.next(SocializerStatus.Loading);
      } else if (loading) {
        this.status$ = Observable.create((observer) => {
          this._statusObserver$ = observer;
          this._statusObserver$.next(SocializerStatus.Loading);
        });
      }
    }

    // Update Loaded Status
    if (this._loadedObserver$ && loaded !== null) {
      this._loadedObserver$.next(loaded);

      // All in One Status Updated
      if (this._statusObserver$) {
        loaded ?
          this._statusObserver$.next(SocializerStatus.Loaded) :
          this._statusObserver$.next(SocializerStatus.NotLoaded);
      }
    }
  }

  protected _updateConnectionStatus(connecting: boolean, connected: boolean) {
    // Update Connecting Status
    if (this._connectingObserver$ && connecting !== null) {
      this._connectingObserver$.next(connecting);

      // All in One Status Updated
      if (connecting && this._statusObserver$) { this._statusObserver$.next(SocializerStatus.Connecting); }
    }

    // Update Connected Status
    if (this._connectedObserver$ && connected !== null) {
      this._connectedObserver$.next(connected);

      // All in One Status Updated
      if (this._statusObserver$) {
        connected ?
          this._statusObserver$.next(SocializerStatus.Connected) :
          this._statusObserver$.next(SocializerStatus.Disconnected);
      }
    }
  }

  protected _updateProfile(profile = DEFAULT_SOCIAL_PROFILE) {
    if (this._profileObserver$) {
      this._profileObserver$.next(profile);
    }
  }
}
