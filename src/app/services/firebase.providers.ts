import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { environment } from '../../environments/environment';

export function provideFirebase(): EnvironmentProviders {
  if (!environment.firebase.enabled) {
    return makeEnvironmentProviders([]);
  }

  return makeEnvironmentProviders([
    provideFirebaseApp(() => initializeApp(environment.firebase.config)),
    provideFirestore(() => getFirestore()),
  ]);
}
