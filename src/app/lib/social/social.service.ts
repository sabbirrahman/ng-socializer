// Imports from @angular
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// Interfaces & Models
import { SocialProfile, SocializerStatus } from '../socializer.interface';
import { DEFAULT_SOCIAL_PROFILE } from '../socializer.model';

@Injectable()
export class SocialService {
  // Profile BehaviorSubjects
  profile$: BehaviorSubject<SocialProfile>;

  // Status BehaviorSubjects
  loading$: BehaviorSubject<boolean>;
  loaded$: BehaviorSubject<boolean>;
  connecting$: BehaviorSubject<boolean>;
  connected$: BehaviorSubject<boolean>;
  status$: BehaviorSubject<number>;

  constructor() {
    // Declare All BehaviorSubjects
    this.profile$ = new BehaviorSubject(DEFAULT_SOCIAL_PROFILE);
    this.loading$ = new BehaviorSubject(false);
    this.loaded$ = new BehaviorSubject(false);
    this.connecting$ = new BehaviorSubject(false);
    this.connected$ = new BehaviorSubject(false);
    this.status$ = new BehaviorSubject(0);
  }

  protected _updateInitiationStatus(loading: boolean, loaded: boolean) {
    // Update Loading Status
    if (loading !== null) {
      this.loading$.next(loading);

      // All in One Status Updated
      if (loading) { this.status$.next(SocializerStatus.Loading); }
    }

    // Update Loaded Status
    if (loaded !== null) {
      this.loaded$.next(loaded);

      // All in One Status Updated
      loaded ?
        this.status$.next(SocializerStatus.Loaded) :
        this.status$.next(SocializerStatus.NotLoaded);
    }
  }

  protected _updateConnectionStatus(connecting: boolean, connected: boolean) {
    // Update Connecting Status
    if (connecting !== null) {
      this.connecting$.next(connecting);

      // All in One Status Updated
      if (connecting) { this.status$.next(SocializerStatus.Connecting); }
    }

    // Update Connected Status
    if (connected !== null) {
      this.connected$.next(connected);

      // All in One Status Updated
      connected ?
        this.status$.next(SocializerStatus.Connected) :
        this.status$.next(SocializerStatus.Disconnected);
    }
  }

  protected _updateProfile(profile = DEFAULT_SOCIAL_PROFILE) {
    this.profile$.next(profile);
  }
}
