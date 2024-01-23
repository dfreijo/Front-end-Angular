import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


  enableProdMode();


// Inicializa aplicación de Firebase
const firebaseConfig = {
  projectId: 'codeflowmiviajep2',
  appId: '1:393014915822:web:b515cdb0e62a07db4879ff',
  databaseURL: 'https://codeflowmiviajep2-default-rtdb.firebaseio.com',
  storageBucket: 'codeflowmiviajep2.appspot.com',
  apiKey: 'AIzaSyDekF2KagY5RaZeChss44SEV_UjC9_gpZc',
  authDomain: 'codeflowmiviajep2.firebaseapp.com',
  messagingSenderId: '393014915822',
  measurementId: 'G-B9HSPQCZWW',
};

const initializeFirebase = async () => {
  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);

  return { app, firestore };
};

initializeFirebase().then(({  }) => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});

  