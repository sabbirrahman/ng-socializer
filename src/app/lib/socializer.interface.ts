// RxJS
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export interface SocialProfile {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  link: string;
  image: string;
  original?: any;
}

export interface SocializerMethod {
  // Status BehaviorSubject
  loading$: BehaviorSubject<boolean>;
  loaded$: BehaviorSubject<boolean>;
  connecting$: BehaviorSubject<boolean>;
  connected$: BehaviorSubject<boolean>;
  // Profile BehaviorSubject
  profile$: BehaviorSubject<SocialProfile>;
  // Basic Methods
  init(config: any): Observable<{ success: boolean }>;
  connect(): Observable<{ success: boolean }>;
  disconnect(): Observable<{ success: boolean }>;
}

export enum SocializerStatus {
  NotLoaded,
  Loading,
  Loaded,
  Disconnected,
  Connecting,
  Connected
}
