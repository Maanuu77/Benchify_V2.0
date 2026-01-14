/**
 * BENCHIFY - GESTIÓN DE AUTENTICACIÓN
 * Basado en Firebase Auth (v10.7.1)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. Configuración de tu proyecto (Extraída de tu consola de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyA4AAnIeIWg1cmXMnXtqeZMsQ_YyQNB0HI",
  authDomain: "benchify-86edd.firebaseapp.com",
  projectId: "benchify-86edd",
  storageBucket: "benchify-86edd.firebasestorage.app",
  messagingSenderId: "809519268011",
  appId: "1:809519268011:web:aca914994685a23eb437ee",
  measurementId: "G-72HS3F2N4R"
};

// 2. Inicializar Firebase y Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Función para registrar nuevos usuarios (Standard, Fotógrafo o Ayuntamiento)
 * @param {string} email 
 * @param {string} password 
 */
export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Usuario registrado con éxito:", userCredential.user.email);
        return userCredential.user;
    } catch (error) {
        console.error("Error en el registro:", error.code, error.message);
        throw error;
    }
};

/**
 * Función para iniciar sesión
 * @param {string} email 
 * @param {string} password 
 */
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Sesión iniciada como:", userCredential.user.email);
        window.location.href = "../index.html"; 
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        alert("Credenciales incorrectas. Inténtalo de nuevo.");
    }
};

/**
 * Función para cerrar sesión
 */
export const logoutUser = async () => {
    try {
        await signOut(auth);
        console.log("Sesión cerrada.");
        window.location.reload();
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};

/**
 * 3. Observador de Estado: Mantiene la UI sincronizada
 * Cambia el texto del botón 'loginBtn' automáticamente
 */
onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById('loginBtn');
    
    if (user) {
        // El usuario está logueado 
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="fa-solid fa-user-circle mr-2"></i> Mi Perfil`;
            loginBtn.onclick = () => window.location.href = 'pages/profile.html';
        }
    } else {
        // El usuario no está logueado
        if (loginBtn) {
            loginBtn.innerHTML = `Iniciar Sesión`;
            // Aquí podrías disparar un modal de login
        }
    }
});