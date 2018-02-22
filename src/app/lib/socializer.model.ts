import { SocialProfile } from './socializer.interface';

export const DEFAULT_SOCIAL_PROFILE: SocialProfile = {
  id: '',
  fullName: '',
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  link: '',
  image: ''
};

Object.defineProperty(DEFAULT_SOCIAL_PROFILE, 'original', { enumerable: false, writable: true });
DEFAULT_SOCIAL_PROFILE.original = {};
