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
      baseUrl: "http://localhost:3000",
      appId: "716c80ee-8289-4360-aceb-de1e225ed096",
      adminId: "fa548fb2-fb4f-42e5-84eb-f0546c11e27f"
  },
  didacClient: {
      baseUrl: "http://localhost:7002"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
