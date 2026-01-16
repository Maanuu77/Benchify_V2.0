/**
 * BENCHIFY - INTEGRACIÓN CON FIREBASE FIRESTORE
 * Este es un ejemplo de cómo conectar el mapa con una base de datos real
 */

// ============================================
// 1. CONFIGURACIÓN DE FIREBASE
// ============================================

// Reemplaza con tus credenciales de Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase (descomenta cuando tengas credenciales)
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
// 
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// ============================================
// 2. OBTENER BANCOS DESDE FIRESTORE
// ============================================

/**
 * Carga todos los bancos de la base de datos
 * @returns {Promise<Array>} Array con todos los bancos
 */
async function loadBenchesFromDatabase() {
    try {
        // Descomentar cuando uses Firebase:
        // const querySnapshot = await getDocs(collection(db, "benches"));
        // const benches = [];
        // querySnapshot.forEach((doc) => {
        //     benches.push({ id: doc.id, ...doc.data() });
        // });
        // return benches;
        
        // Por ahora, retorna los datos locales
        return benchesData;
    } catch (error) {
        console.error("Error al cargar bancos:", error);
        return [];
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
        // Descomentar cuando uses Firebase:
        // const docRef = await addDoc(collection(db, "benches"), benchData);
        // return docRef.id;
        
        // Por ahora, simula la creación local
        console.log("Nuevo banco creado:", benchData);
        return "local_" + Date.now();
    } catch (error) {
        console.error("Error al crear banco:", error);
        throw error;
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
        // Descomentar cuando uses Firebase:
        // await updateDoc(doc(db, "benches", benchId), updates);
        
        console.log("Banco actualizado:", benchId, updates);
    } catch (error) {
        console.error("Error al actualizar banco:", error);
        throw error;
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
        // Descomentar cuando uses Firebase:
        // await deleteDoc(doc(db, "benches", benchId));
        
        console.log("Banco eliminado:", benchId);
    } catch (error) {
        console.error("Error al eliminar banco:", error);
        throw error;
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
        // Descomentar cuando uses Firebase:
        // const docSnap = await getDoc(doc(db, "benches", benchId));
        // if (docSnap.exists()) {
        //     return { id: docSnap.id, ...docSnap.data() };
        // }
        
        return null;
    } catch (error) {
        console.error("Error al obtener banco:", error);
        return null;
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
        console.error("Error al buscar bancos:", error);
        return [];
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
        // Descomentar cuando uses Firebase:
        // const reviewsRef = collection(db, "benches", benchId, "reviews");
        // await addDoc(reviewsRef, {
        //     author: review.author,
        //     rating: review.rating,
        //     text: review.text,
        //     timestamp: new Date()
        // });
        
        console.log("Reseña añadida:", review);
    } catch (error) {
        console.error("Error al añadir reseña:", error);
        throw error;
    }
}

/**
 * Obtiene todas las reseñas de un banco
 * @param {String} benchId - ID del banco
 * @returns {Promise<Array>} Array de reseñas
 */
async function getReviews(benchId) {
    try {
        // Descomentar cuando uses Firebase:
        // const reviewsRef = collection(db, "benches", benchId, "reviews");
        // const querySnapshot = await getDocs(reviewsRef);
        // const reviews = [];
        // querySnapshot.forEach((doc) => {
        //     reviews.push({ id: doc.id, ...doc.data() });
        // });
        // return reviews;
        
        return [];
    } catch (error) {
        console.error("Error al obtener reseñas:", error);
        return [];
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
        // Descomentar cuando uses Firebase:
        // await updateDoc(doc(db, "users", userId), {
        //     favorites: arrayUnion(benchId)
        // });
        
        localStorage.setItem(`fav_${benchId}`, 'true');
        console.log("Banco añadido a favoritos");
    } catch (error) {
        console.error("Error al añadir a favoritos:", error);
    }
}

/**
 * Obtiene los favoritos del usuario
 * @param {String} userId - ID del usuario
 * @returns {Promise<Array>} Array de IDs de favoritos
 */
async function getFavorites(userId) {
    try {
        // Descomentar cuando uses Firebase:
        // const userDoc = await getDoc(doc(db, "users", userId));
        // return userDoc.data()?.favorites || [];
        
        // Por ahora, usa localStorage
        return Object.keys(localStorage)
            .filter(key => key.startsWith('fav_'))
            .map(key => key.replace('fav_', ''));
    } catch (error) {
        console.error("Error al obtener favoritos:", error);
        return [];
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
        console.error("Error al obtener estadísticas:", error);
        return {};
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
