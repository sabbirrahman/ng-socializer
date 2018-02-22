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
  // Status Observables
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  connecting$: Observable<boolean>;
  connected$: Observable<boolean>;
  // Profile Observables
  profile$: Observable<SocialProfile>;
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
