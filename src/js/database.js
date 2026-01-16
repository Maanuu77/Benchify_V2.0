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
    doc,
    updateDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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
 * @param {Object} benchData - Datos del banco, coordenadas, ratings y foto (opcional)
 */
export const saveBench = async (benchData) => {
    try {
        const docRef = await addDoc(collection(db, "Bancos"), {
            nombre: benchData.nombre,
            descripcion: benchData.descripcion || "",
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
            fotoURL: benchData.fotoURL || null, // URL de la foto en Firebase Storage
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

/**
 * Sube una imagen a Firebase Storage y retorna su URL pública
 * @param {File} file - El archivo de imagen a subir
 * @param {string} benchId - ID único del banco (para organizar en carpetas)
 * @returns {Promise<string>} URL pública de la imagen
 */
export const uploadBenchPhoto = async (file, benchId) => {
    try {
        if (!file) return null;
        
        // Validar tipo de archivo
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            throw new Error('Formato de imagen no permitido. Usa JPG, PNG, WebP o GIF');
        }
        
        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Imagen muy grande. Máximo 5MB');
        }
        
        // Crear referencia en Storage
        const timestamp = Date.now();
        const storagePath = `bancos/${benchId || 'temp'}/foto-${timestamp}`;
        const storageRef = ref(storage, storagePath);
        
        // Subir archivo
        await uploadBytes(storageRef, file);
        
        // Obtener URL pública
        const publicURL = await getDownloadURL(storageRef);
        console.log('Foto subida exitosamente:', publicURL);
        
        return publicURL;
    } catch (error) {
        console.error("Error al subir foto:", error);
        throw error;
    }
};

/**
 * Actualiza un banco existente con nuevos datos (ej: agregar foto después de crear)
 * @param {string} benchId - ID del banco a actualizar
 * @param {Object} updates - Objeto con campos a actualizar
 */
export const updateBench = async (benchId, updates) => {
    try {
        const benchRef = doc(db, "Bancos", benchId);
        await updateDoc(benchRef, {
            ...updates,
            fecha_actualizacion: serverTimestamp()
        });
        console.log("Banco actualizado:", benchId);
    } catch (error) {
        console.error("Error al actualizar banco:", error);
        throw error;
    }
};

console.log("Módulo database.js cargado y conectado a Benchify.");