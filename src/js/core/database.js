/**
 * BENCHIFY - MÓDULO CENTRAL DE BASE DE DATOS Y CONFIGURACIÓN
 * Este archivo conecta la web con Firebase y gestiona los datos de los bancos.
 */

import { 
    collection, 
    addDoc, 
    getDocs, 
    doc,
    updateDoc,
    serverTimestamp,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { db, auth, storage } from "./firebase-init.js";

// Firebase inicializado en `./firebase-init.js` y exportado como `db`, `auth`, `storage`.

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
            ratings: {
                vistas: benchData.vistas || 0,
                privacidad: benchData.privacidad || 0,
                comodidad: benchData.comodidad || 0,
                atmosfera: benchData.atmosfera || 0
            },
            fotoURL: benchData.fotoURL || null,
            etiquetas: benchData.etiquetas || [],
            userId: auth.currentUser ? auth.currentUser.uid : "anonimo",
            fecha_creacion: serverTimestamp()
        });
        console.log("Banco registrado con ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        const msg = `saveBench: error saving banco - ${error.message || error}`;
        console.error(msg, error);
        throw new Error(msg);
    }
};

/**
 * Obtiene la lista de todos los bancos para renderizar los "pines" en el mapa
 */
export const getAllBenches = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "Bancos"));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        const msg = `getAllBenches: error retrieving bancos - ${error.message || error}`;
        console.error(msg, error);
        throw new Error(msg);
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
        const msg = `uploadBenchPhoto: error uploading photo - ${error.message || error}`;
        console.error(msg, error);
        throw new Error(msg);
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
        const msg = `updateBench: error updating banco ${benchId} - ${error.message || error}`;
        console.error(msg, error);
        throw new Error(msg);
    }
};

/**
 * Devuelve un mensaje amigable apto para mostrar en UI según el error de Firebase
 * @param {Error|any} error
 * @returns {string}
 */
export const getFriendlyErrorMessage = (error) => {
    const text = error?.message || String(error);
    if (text.includes('permission-denied')) return 'No tienes permisos para realizar esta acción.';
    if (text.includes('auth/')) return 'Error de autenticación. Por favor inicia sesión.';
    if (text.includes('network') || text.includes('unavailable')) return 'Error de red. Revisa tu conexión e inténtalo de nuevo.';
    return 'Se produjo un error inesperado. Inténtalo de nuevo más tarde.';
};

console.log("Módulo database.js cargado y conectado a Benchify.");
