// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCpmUgPSSinuX0Hn8qLi68h7lvIVFrRqkk",
    authDomain: "teacher-didac.firebaseapp.com",
    projectId: "teacher-didac",
    storageBucket: "teacher-didac.appspot.com",
    messagingSenderId: "863867551765",
    appId: "1:863867551765:web:cef87a474bbad4eafd4e1c",
    measurementId: "G-F0NXY27WJ5"
  },
  authenticationClient: {
      baseUrl: "https://localhost:3000"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
