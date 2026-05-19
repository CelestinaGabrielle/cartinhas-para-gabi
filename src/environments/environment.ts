import { FirebaseOptions } from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Cole aqui o firebaseConfig do app Web criado no Firebase Console.
// Caminho: Configuracoes do projeto > Seus apps > SDK setup and configuration.
export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAgV_65cUw3BoxASSoUKhaDrS3SOj35EcQ",
  authDomain: "cartinhas-para-a-gabi.firebaseapp.com",
  projectId: "cartinhas-para-a-gabi",
  storageBucket: "cartinhas-para-a-gabi.firebasestorage.app",
  messagingSenderId: "683471898006",
  appId: "1:683471898006:web:3963eb453383457e6149b7",
  measurementId: "G-4Y07C17XST"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const environment = {
  production: false,
  firebaseConfig,
};

export function firebaseConfigPreenchido(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}
