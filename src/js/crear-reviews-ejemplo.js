/**
 * Script para crear automáticamente las subcolecciones de reviews en Firebase
 * Ejecuta esto en la consola de tu navegador después de importar el JSON en Firebase
 * 
 * PASOS:
 * 1. Importa el archivo firebase_database_estructura.json en Firebase
 * 2. Abre index.html en tu navegador
 * 3. Abre la consola (F12) y copia-pega este código
 * 4. Ejecuta: crearReviewsDeEjemplo()
 */

import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./src/js/firebase-init.js";

// Datos de ejemplo para las reviews
const reviewsData = {
  banco_001: [
    {
      author: "María",
      authorId: "user_456",
      rating: 5,
      text: "Lugar absolutamente mágico. La vista al atardecer es espectacular. Altamente recomendado para momentos especiales.",
      timestamp: "2024-01-15T16:45:00Z"
    },
    {
      author: "Carlos",
      authorId: "user_789",
      rating: 4,
      text: "Excelente ubicación. Un poco concurrido a ciertas horas, pero vale la pena visitarlo.",
      timestamp: "2024-01-14T19:20:00Z"
    }
  ],
  banco_002: [
    {
      author: "Juan",
      authorId: "user_123",
      rating: 5,
      text: "La mejor forma de pasar una tarde relajante en Madrid. La naturaleza es increíble.",
      timestamp: "2024-01-13T17:30:00Z"
    }
  ],
  banco_003: [
    {
      author: "Luis",
      authorId: "user_def",
      rating: 4,
      text: "Ambiente único, muy social. Perfecto para pasar un buen rato con amigos.",
      timestamp: "2024-01-12T20:15:00Z"
    },
    {
      author: "Ana",
      authorId: "user_abc",
      rating: 3,
      text: "Buen lugar pero muy ruidoso para mi gusto. No lo recomiendo si buscas tranquilidad.",
      timestamp: "2024-01-11T21:00:00Z"
    }
  ],
  banco_004: [
    {
      author: "María",
      authorId: "user_456",
      rating: 5,
      text: "La discreción y privacidad que buscaba. Un oasis en el corazón de la ciudad.",
      timestamp: "2024-01-10T18:45:00Z"
    }
  ],
  banco_005: [
    {
      author: "Juan",
      authorId: "user_123",
      rating: 4,
      text: "Excelente para comer algo en las cercanías. El ambiente es muy acogedor.",
      timestamp: "2024-01-09T19:30:00Z"
    }
  ]
};

/**
 * Crea todas las reviews de ejemplo en Firebase
 */
export const crearReviewsDeEjemplo = async () => {
  try {
    console.log("⏳ Iniciando creación de reviews...");
    let totalCreadas = 0;

    for (const [bencoId, reviews] of Object.entries(reviewsData)) {
      for (const review of reviews) {
        try {
          const reviewsRef = collection(db, "Bancos", bencoId, "reviews");
          await addDoc(reviewsRef, {
            author: review.author,
            authorId: review.authorId,
            rating: review.rating,
            text: review.text,
            timestamp: new Date(review.timestamp)
          });
          console.log(`✅ Review agregada a ${bencoId} por ${review.author}`);
          totalCreadas++;
        } catch (error) {
          console.error(`❌ Error al agregar review a ${bencoId}:`, error.message);
        }
      }
    }

    console.log(`\n✨ Proceso completado. Se crearon ${totalCreadas} reviews en total.`);
    return totalCreadas;
  } catch (error) {
    console.error("❌ Error general:", error);
    throw error;
  }
};

// Ejecutar
console.log("Script cargado. Ejecuta: crearReviewsDeEjemplo()");
