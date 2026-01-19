/**
 * BENCHIFY - MANEJADOR DE BANCOS OSM EN FORMULARIO
 * Detecta cuando un usuario viene de un banco de OpenStreetMap
 * y pre-rellena el formulario con los datos del banco
 */

/**
 * Detecta si el usuario viene de un banco OSM y pre-rellena los datos
 */
export function initOSMBankPreFill() {
    // Leer parámetros de URL
    const urlParams = new URLSearchParams(window.location.search);
    const fromOSM = urlParams.get('fromOSM') === 'true';
    const osmId = urlParams.get('osmId');

    if (!fromOSM || !osmId) {
        console.log('No hay datos de OSM para pre-rellenar');
        return;
    }

    // Leer datos del banco de OSM guardados en sessionStorage
    const osmDataStr = sessionStorage.getItem('osmBankData');
    if (!osmDataStr) {
        console.warn('⚠️ No se encontraron datos de OSM en sessionStorage');
        return;
    }

    try {
        const osmData = JSON.parse(osmDataStr);
        console.log('✅ Datos de OSM encontrados:', osmData);

        // Pre-rellenar el formulario
        preFillFormWithOSMData(osmData);

        // Mostrar banner informativo
        showOSMInfoBanner(osmData);

        // Limpiar sessionStorage después de usar
        sessionStorage.removeItem('osmBankData');
    } catch (error) {
        console.error('❌ Error al procesar datos de OSM:', error);
    }
}

/**
 * Pre-rellena el formulario con datos del banco OSM
 * @param {Object} osmData - Datos del banco de OpenStreetMap
 */
function preFillFormWithOSMData(osmData) {
    // Nombre del banco
    const nameField = document.getElementById('benchName');
    if (nameField) {
        nameField.value = osmData.nombre || '';
        nameField.style.backgroundColor = '#fef3c7'; // Destacar en amarillo
    }

    // Coordenadas
    const latField = document.getElementById('latitude');
    const lngField = document.getElementById('longitude');
    
    if (latField && lngField) {
        latField.value = osmData.lat;
        lngField.value = osmData.lng;
    }

    // Actualizar mapa si existe
    updateMapWithOSMCoords(osmData.lat, osmData.lng);

    // Descripción (placeholder informativo)
    const descField = document.getElementById('benchDescription');
    if (descField && !descField.value) {
        descField.placeholder = `Cuéntanos qué te parece este banco de ${osmData.nombre}. ¿Es un buen lugar para sentarse? ¿Las vistas son bonitas? ¿Es cómodo?`;
    }

    // Marcar como proveniente de OSM (para tracking posterior si es necesario)
    const form = document.getElementById('addBenchForm');
    if (form) {
        form.dataset.osmBank = 'true';
        form.dataset.osmId = osmData.osmId;
    }

    console.log('✅ Formulario pre-rellenado con datos de OSM');
}

/**
 * Actualiza el mapa para mostrar la ubicación del banco OSM
 */
function updateMapWithOSMCoords(lat, lng) {
    // Esperar a que el mapa esté inicializado (puede estar en construcción)
    const waitForMap = setInterval(() => {
        if (window.mapInstance && window.mapInstance.setView) {
            window.mapInstance.setView([lat, lng], 17);
            
            // Agregar un marcador temporal
            const tempMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'osm-prefill-marker',
                    html: `<i class="fa-solid fa-building text-blue-600 text-3xl drop-shadow-md"></i>`,
                    iconSize: [32, 40],
                    iconAnchor: [16, 40]
                })
            }).addTo(window.mapInstance).bindPopup('Banco de OpenStreetMap');

            clearInterval(waitForMap);
            console.log('✅ Mapa actualizado con coordenadas de OSM');
        }
    }, 100);

    // Timeout de seguridad (5 segundos)
    setTimeout(() => clearInterval(waitForMap), 5000);
}

/**
 * Muestra un banner informativo sobre que el banco viene de OSM
 */
function showOSMInfoBanner(osmData) {
    const banner = document.createElement('div');
    banner.className = 'osm-info-banner';
    banner.style.cssText = `
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        padding: 1rem;
        margin-bottom: 1.5rem;
        border-radius: 8px;
        border-left: 4px solid #1e40af;
        font-size: 0.95rem;
    `;

    banner.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: start;">
            <div style="font-size: 1.5rem;">🏛️</div>
            <div>
                <strong>${osmData.nombre}</strong> es un banco registrado en OpenStreetMap.
                <br>
                <span style="font-size: 0.9rem; opacity: 0.95;">
                    Tus datos de ubicación han sido pre-cargados. Ahora cuéntanos tu experiencia en este banco y comparte tu reseña con la comunidad.
                </span>
            </div>
        </div>
    `;

    // Insertar el banner al inicio del formulario
    const form = document.getElementById('addBenchForm');
    if (form) {
        form.insertBefore(banner, form.firstChild);
    }
}

/**
 * Modifica el comportamiento del guardado para bancos OSM
 * (puede agregar datos adicionales o tracking)
 */
export function handleOSMBankSave(benchData, osmId) {
    // Marcar en los datos que este banco viene de una conversión de OSM
    return {
        ...benchData,
        esConversionOSM: true,
        osmIdOrigen: osmId,
        fechaConversion: new Date().toISOString()
    };
}

// Auto-ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initOSMBankPreFill();
});
