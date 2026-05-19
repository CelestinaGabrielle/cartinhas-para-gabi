import { FirebaseOptions } from 'firebase/app';

export const environment = {
  production: false,
  firebase: {
    enabled: false,
    // Para conectar o Firestore:
    // 1. Crie um projeto no Firebase.
    // 2. Copie o objeto "firebaseConfig" do app Web.
    // 3. Preencha os campos abaixo e troque enabled para true.
    config: {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    } satisfies FirebaseOptions,
  },
};
