/**
 * BENCHIFY - MÓDULO CENTRAL DE BASE DE DATOS Y CONFIGURACIÓN
 * Este archivo conecta la web con Firebase y gestiona los datos de los bancos.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// 1. Configuración oficial de tu proyecto Benchify
const firebaseConfig = {
  apiKey: "AIzaSyA4AAnIeIWg1cmXMnXtqeZMsQ_YyQNB0HI",
  authDomain: "benchify-86edd.firebaseapp.com",
  projectId: "benchify-86edd",
  storageBucket: "benchify-86edd.firebasestorage.app",
  messagingSenderId: "809519268011",
  appId: "1:809519268011:web:aca914994685a23eb437ee",
  measurementId: "G-72HS3F2N4R"
};

// 2. Inicialización de los servicios
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);      // Base de datos para Bancos y Reseñas [cite: 7]
export const auth = getAuth(app);         // Gestión de usuarios [cite: 9]
export const storage = getStorage(app);   // Almacenamiento de fotos [cite: 9]

/**
 * 3. FUNCIONES DE DATOS (CRUD)
 */

/**
 * Guarda un banco con el sistema de benchmarking social (1-5 estrellas)
 * @param {Object} benchData - Datos del banco, coordenadas y ratings
 */
export const saveBench = async (benchData) => {
    try {
        const docRef = await addDoc(collection(db, "Bancos"), {
            nombre: benchData.nombre,
            coordenadas: {
                lat: benchData.lat,
                lng: benchData.lng
            },
            // Sistema de Ranking detallado en la documentación [cite: 56, 57, 58, 59, 84, 86, 87, 88]
            ratings: {
                vistas: benchData.vistas || 0,
                privacidad: benchData.privacidad || 0,
                comodidad: benchData.comodidad || 0,
                atmosfera: benchData.atmosfera || 0
            },
            etiquetas: benchData.etiquetas || [], // Ej: "Perfecto para pedida" [cite: 55, 89]
            userId: auth.currentUser ? auth.currentUser.uid : "anonimo",
            fecha_creacion: serverTimestamp()
        });
        console.log("Banco registrado con ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error al guardar en Firestore:", error);
        throw error;
    }
};

/**
 * Obtiene la lista de todos los bancos para renderizar los "pines" en el mapa [cite: 70]
 */
export const getAllBenches = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "Bancos"));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error al recuperar bancos:", error);
        return [];
    }
};

console.log("Módulo database.js cargado y conectado a Benchify.");