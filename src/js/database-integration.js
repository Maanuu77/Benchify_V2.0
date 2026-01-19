/**
 * BENCHIFY - INTEGRACIÓN CON FIREBASE FIRESTORE
 * Este es un ejemplo de cómo conectar el mapa con una base de datos real
 */

// ============================================
// 1. CONFIGURACIÓN DE FIREBASE
// ============================================

import { collection, getDocs, addDoc, updateDoc, deleteDoc, getDoc, doc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase-init.js";

// ============================================
// 2. OBTENER BANCOS DESDE FIRESTORE
// ============================================

/**
 * Carga todos los bancos de la base de datos
 * @returns {Promise<Array>} Array con todos los bancos
 */
async function loadBenchesFromDatabase() {
    try {
        const querySnapshot = await getDocs(collection(db, "Bancos"));
        const benches = [];
        querySnapshot.forEach((doc) => {
        benches.push({ id: doc.id, ...doc.data() });
        });
        return benches;
    } catch (error) {
        const msg = `loadBenchesFromDatabase: ${error.message || error}`;
        console.error(msg, error);
        throw new Error(msg);
    }
}

// ============================================
// 3. CREAR NUEVO BANCO
// ============================================

/**
 * Añade un nuevo banco a la base de datos
 * @param {Object} benchData - Datos del banco
 * @returns {Promise<String>} ID del documento creado
 */
async function createNewBench(benchData) {
    try {
        const docRef = await addDoc(collection(db, "Bancos"), benchData);
        return docRef.id;
    } catch (error) {
        const msg = `createNewBench: ${error.message || error}`;
        console.error(msg, error);
        throw new Error(msg);
    }
}

// ============================================
// 4. ACTUALIZAR BANCO
// ============================================

/**
 * Actualiza un banco existente
 * @param {String} benchId - ID del banco
 * @param {Object} updates - Cambios a realizar
 */
async function updateBench(benchId, updates) {
    try {
        await updateDoc(doc(db, "Bancos", benchId), updates);
        console.log("Banco actualizado:", benchId, updates);
    } catch (error) {
        const msg = `updateBench: ${error.message || error}`;
        console.error(msg, error);
        throw new Error(msg);
    }
}

// ============================================
// 5. ELIMINAR BANCO
// ============================================

/**
 * Elimina un banco de la base de datos
 * @param {String} benchId - ID del banco
 */
async function deleteBench(benchId) {
    try {
        await deleteDoc(doc(db, "Bancos", benchId));
        console.log("Banco eliminado:", benchId);
    } catch (error) {
        const msg = `deleteBench: ${error.message || error}`;
        console.error(msg, error);
        throw new Error(msg);
    }
}

// ============================================
// 6. OBTENER BANCO POR ID
// ============================================

/**
 * Obtiene un banco específico por su ID
 * @param {String} benchId - ID del banco
 * @returns {Promise<Object|null>} Datos del banco o null
 */
async function getBenchById(benchId) {
    try {
        const docSnap = await getDoc(doc(db, "Bancos", benchId));
        if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        const msg = `getBenchById: ${error.message || error}`;
        console.error(msg, error);
        throw new Error(msg);
    }
}

// ============================================
// 7. BUSCAR BANCOS POR CRITERIOS
// ============================================

/**
 * Busca bancos según filtros avanzados
 * @param {Object} filters - Criterios de búsqueda
 * @returns {Promise<Array>} Bancos que coinciden
 */
async function searchBenches(filters) {
    try {
        let benches = await loadBenchesFromDatabase();
        
        // Aplicar filtros
        if (filters.minViews) {
            benches = benches.filter(b => b.ratings.views >= filters.minViews);
        }
        
        if (filters.minPrivacy) {
            benches = benches.filter(b => b.ratings.privacy >= filters.minPrivacy);
        }
        
        if (filters.tags && filters.tags.length > 0) {
            benches = benches.filter(b => 
                b.tags.some(tag => filters.tags.includes(tag))
            );
        }
        
        if (filters.location) {
            // Implementar búsqueda geoespacial
            // Esto requeriría consultas más complejas de Firestore
        }
        
        return benches;
    } catch (error) {
        const msg = `searchBenches: ${error.message || error}`;
        console.error(msg, error);
        throw new Error(msg);
    }
}

// ============================================
// 8. RESEÑAS Y VALORACIONES
// ============================================

/**
 * Añade una reseña a un banco
 * @param {String} benchId - ID del banco
 * @param {Object} review - Datos de la reseña
 */
async function addReview(benchId, review) {
    try {
        const reviewsRef = collection(db, "Bancos", benchId, "reviews");
        await addDoc(reviewsRef, {
        author: review.author,
        rating: review.rating,
        text: review.text,
        timestamp: new Date()
         });
        console.log("Reseña añadida:", review);
    } catch (error) {
        const msg = `addReview: ${error.message || error}`;
        console.error(msg, error);
        throw new Error(msg);
    }
}

/**
 * Obtiene todas las reseñas de un banco
 * @param {String} benchId - ID del banco
 * @returns {Promise<Array>} Array de reseñas
 */
async function getReviews(benchId) {
    try {
        const reviewsRef = collection(db, "Bancos", benchId, "reviews");
        const querySnapshot = await getDocs(reviewsRef);
        const reviews = [];
        querySnapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() });
        });
        return reviews;
    } catch (error) {
        const msg = `getReviews: ${error.message || error}`;
        console.error(msg, error);
        throw new Error(msg);
    }
}

// ============================================
// 9. FAVORITOS DEL USUARIO
// ============================================

/**
 * Añade un banco a favoritos
 * @param {String} userId - ID del usuario
 * @param {String} benchId - ID del banco
 */
async function addToFavorites(userId, benchId) {
    try {
        await updateDoc(doc(db, "users", userId), {
        favorites: arrayUnion(benchId)
        });

        localStorage.setItem(`fav_${benchId}`, 'true');
        console.log("Banco añadido a favoritos");
    } catch (error) {
        const msg = `addToFavorites: ${error.message || error}`;
        console.error(msg, error);
    }
}

/**
 * Obtiene los favoritos del usuario
 * @param {String} userId - ID del usuario
 * @returns {Promise<Array>} Array de IDs de favoritos
 */
async function getFavorites(userId) {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        return userDoc.data()?.favorites || [];
    } catch (error) {
        const msg = `getFavorites: ${error.message || error}`;
        console.error(msg, error);
        throw new Error(msg);
    }
}

// ============================================
// 10. ESTADÍSTICAS
// ============================================

/**
 * Obtiene estadísticas globales de la aplicación
 * @returns {Promise<Object>} Datos estadísticos
 */
async function getStatistics() {
    try {
        const benches = await loadBenchesFromDatabase();
        
        return {
            totalBenches: benches.length,
            avgViews: (benches.reduce((sum, b) => sum + b.ratings.views, 0) / benches.length).toFixed(2),
            avgPrivacy: (benches.reduce((sum, b) => sum + b.ratings.privacy, 0) / benches.length).toFixed(2),
            avgComfort: (benches.reduce((sum, b) => sum + b.ratings.comfort, 0) / benches.length).toFixed(2),
            allTags: [...new Set(benches.flatMap(b => b.tags))]
        };
    } catch (error) {
        const msg = `getStatistics: ${error.message || error}`;
        console.error(msg, error);
        throw new Error(msg);
    }
}

// Exportar para usar en otros archivos (si usas módulos ES6)
export {
    loadBenchesFromDatabase,
    createNewBench,
    updateBench,
    deleteBench,
    getBenchById,
    searchBenches,
    addReview,
    getReviews,
    addToFavorites,
    getFavorites,
    getStatistics
};
