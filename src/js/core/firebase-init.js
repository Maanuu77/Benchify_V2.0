import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Centraliza la inicialización de Firebase para evitar configuraciones duplicadas
const firebaseConfig = {
  apiKey: "AIzaSyA4AAnIeIWg1cmXMnXtqeZMsQ_YyQNB0HI",
  authDomain: "benchify-86edd.firebaseapp.com",
  projectId: "benchify-86edd",
  storageBucket: "benchify-86edd.firebasestorage.app",
  messagingSenderId: "809519268011",
  appId: "1:809519268011:web:aca914994685a23eb437ee",
  measurementId: "G-72HS3F2N4R"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;

/*
  SUGERENCIA DE REGLAS DE FIRESTORE
  ---------------------------------
  Este proyecto incluye un ejemplo de reglas en `firestore.rules` (archivo raíz).

  Resumen de la política propuesta:
  - Lectura de `Bancos`: pública (permitir a cualquiera ver bancos). Cambia a `request.auth != null` para restringir.
  - Crear `Bancos`: solo usuarios autenticados; el campo `userId` del documento debe coincidir con `request.auth.uid`.
  - Actualizar/Eliminar `Bancos`: solo el creador (resource.data.userId == request.auth.uid).

  Despliegue rápido desde la CLI (si tienes Firebase CLI configurada):
    npm install -g firebase-tools
    firebase deploy --only firestore:rules

  IMPORTANTE: Las reglas son la principal defensa de tu proyecto. No confíes en ocultar `apiKey` del cliente.
*/
