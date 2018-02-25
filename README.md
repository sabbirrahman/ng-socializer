# ng-socializer [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=A%20Collection%20of%20Angular%20Services%20for%20Social%20Integration&url=https://github.com/sabbirrahman/ng-socializer&via=sabbirrahmanme&hashtags=angular,ng,socializer)
>A Collection of Angular Services for Social Integration.

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/sabbirrahman/ng-socializer/blob/master/LICENSE)
[![NPM version](https://badge.fury.io/js/ng-socializer.svg)](https://www.npmjs.com/package/ng-socializer)
<!-- [![Build Status](https://travis-ci.org/sabbirrahman/ng-socializer.svg?branch=master)](https://travis-ci.org/sabbirrahman/ng-socializer) -->

Do you find integrating social network into your angular application harder? Fear no more, ng-socializer lets you integrate social networks such as facebook, google, instagram and pinterest easily.

## Features
* Supports facebook, google, instagram and pinterest.
* Easy and common API for all supported social networks.
* Common data structure for user profile reponse.
* RxJS observable based.
* Strongly typed API.

## Installation
`npm install --save ng-socializer`

## How To

1. Import SocializerModule into Your App/Root Module
```typescript
import { SocializerModule } from 'ng-socializer';

@NgModule({
  ...
  imports: [
    SocializerModule.forRoot()
  ]
  ...
})
export class AppModule { }
```

2. Import and initialize the social sdk that you need from any component
```typescript
import { FacebookSocializer } from 'ng-socializer';

export class MySocialComponent implements OnInit {
  constructor(private facebookSocializer: FacebookSocializer) {}
  ngOnInit() {
    this.facebookSocializer.init({ appId: appId }).subscribe();
  }
}
```

3. Use the service to connect and get user's profile informations
```typescript
import { FacebookSocializer, SocialProfile } from 'ng-socializer';

export class MySocialComponent implements OnInit {
  ...
  ngOnInit() {
    ...
    // Everytime User Connects or Disconnects, A Value will be Emmited from profile$ Observable
    this.facebookSocializer.profile$.subscribe((profile) => {
      console.log(profile);
    });
  }

  // Call This Method from View on Click Event
  connectWithFacebook() {
    this.facebookSocializer.connect().subscribe();
  }

  // Don't Forget to Unsubscribe
  ngOnInit() {
    if (this.facebookSocializer.profile$) {
      this.facebookSocializer.profile$.unsubscribe();
    }
  }
  ...
}
```

## Documentation

See full documentation [here](https://github.com/sabbirrahman/ng-socializer/blob/master/DOCUMENTATION.md).

<!-- ## Development & Contribution

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io). This will help you to run and debug your code if you wish to contribute to the development of this library.-->

Enjoy 😃 
