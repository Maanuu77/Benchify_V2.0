/**
 * BENCHIFY - EJEMPLOS Y PERSONALIZACIONES
 * Snippets de código para usar en el mapa
 */

// ============================================
// 1. MOSTRAR UBICACIÓN ACTUAL DEL USUARIO
// ============================================

function showUserLocation(mapInstance) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            // Crear icono del usuario
            const userIcon = L.divIcon({
                className: 'user-marker',
                html: `<i class="fa-solid fa-user-location text-blue-600 text-2xl"></i>`,
                iconSize: [25, 25],
                iconAnchor: [12, 12]
            });
            
            // Añadir marcador
            L.marker([userLat, userLng], { icon: userIcon })
                .addTo(mapInstance)
                .bindPopup('Tu ubicación actual');
            
            // Centrar mapa en usuario
            mapInstance.setView([userLat, userLng], 15);
            
            // Dibujar círculo de radio de búsqueda (opcional)
            L.circle([userLat, userLng], {
                color: 'blue',
                fillColor: '#add8e6',
                fillOpacity: 0.2,
                radius: 500 // 500 metros
            }).addTo(mapInstance);
        });
    }
}

// Uso:
// showUserLocation(map);

// ============================================
// 2. BUSCAR BANCO POR NOMBRE
// ============================================

function searchBenchByName(mapInstance, searchTerm) {
    // Limpiar pines anteriores
    mapInstance.eachLayer(layer => {
        if (layer instanceof L.Marker && layer !== userMarker) {
            mapInstance.removeLayer(layer);
        }
    });
    
    // Filtrar bancos
    const filtered = benchesData.filter(bench => 
        bench.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filtered.length === 0) {
        alert('No se encontraron bancos con ese nombre');
        return;
    }
    
    // Mostrar resultados
    filtered.forEach(bench => {
        const marker = L.marker(bench.location).addTo(mapInstance);
        marker.bindPopup(bench.name);
    });
    
    // Centrar en el primer resultado
    mapInstance.setView(filtered[0].location, 14);
}

// Uso:
// searchBenchByName(map, "Retiro");

// ============================================
// 3. DIBUJAR RUTA ENTRE DOS PUNTOS
// ============================================

function drawRoute(mapInstance, point1, point2) {
    // Crear línea entre dos puntos
    L.polyline([point1, point2], {
        color: 'green',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 5'
    }).addTo(mapInstance);
    
    // Calcular distancia
    const distance = calculateDistance(point1, point2);
    
    // Mostrar distancia en consola
    console.log(`Distancia: ${distance} km`);
    
    // Ajustar zoom para ver ambos puntos
    const bounds = L.latLngBounds([point1, point2]);
    mapInstance.fitBounds(bounds.pad(0.1));
}

// Uso:
// drawRoute(map, [40.416775, -3.703790], [40.418308, -3.682664]);

// ============================================
// 4. CREAR CLUSTER DE PINES
// ============================================

// Necesita: <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>
// Y CSS: <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />

function createMarkerCluster(mapInstance, benchesArray) {
    const markerClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 80,
        disableClusteringAtZoom: 15
    });
    
    benchesArray.forEach(bench => {
        const marker = L.marker(bench.location);
        marker.bindPopup(bench.name);
        markerClusterGroup.addLayer(marker);
    });
    
    mapInstance.addLayer(markerClusterGroup);
}

// Uso:
// createMarkerCluster(map, benchesData);

// ============================================
// 5. HEATMAP DE BANCOS MÁS POPULARES
// ============================================

// Necesita: <script src="https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>

function createHeatmap(mapInstance, benchesArray) {
    // Extraer coordenadas y intensidad (vistas)
    const heatData = benchesArray.map(bench => [
        bench.location[0],
        bench.location[1],
        bench.ratings.views / 5 // Normalizar a 0-1
    ]);
    
    L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 1
    }).addTo(mapInstance);
}

// Uso:
// createHeatmap(map, benchesData);

// ============================================
// 6. MOSTRAR BANCOS CERCANOS (RADIO)
// ============================================

function findNearbyBenches(mapInstance, centerCoord, radiusKm) {
    const nearby = benchesData.filter(bench => {
        const distance = parseFloat(calculateDistance(centerCoord, bench.location));
        return distance <= radiusKm;
    });
    
    // Limpiar mapa
    mapInstance.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            mapInstance.removeLayer(layer);
        }
    });
    
    // Mostrar bancos cercanos
    nearby.forEach(bench => {
        const marker = L.marker(bench.location).addTo(mapInstance);
        marker.bindPopup(bench.name);
    });
    
    // Dibujar círculo
    L.circle(centerCoord, {
        color: 'green',
        fillColor: '#90ee90',
        fillOpacity: 0.2,
        radius: radiusKm * 1000
    }).addTo(mapInstance);
    
    console.log(`Se encontraron ${nearby.length} bancos en ${radiusKm}km`);
}

// Uso:
// findNearbyBenches(map, [40.416775, -3.703790], 2); // 2km de radio

// ============================================
// 7. CAMBIAR ESTILO DEL POPUP
// ============================================

function createCustomPopup(bench) {
    return `
        <div class="custom-popup" style="
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
            border-radius: 12px;
            padding: 15px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            font-family: 'Inter', sans-serif;
            min-width: 250px;
        ">
            <h3 style="margin: 0 0 10px 0; font-size: 18px;">🏞️ ${bench.name}</h3>
            <p style="margin: 0 0 8px 0; font-size: 13px; opacity: 0.95;">${bench.description}</p>
            <div style="
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 8px;
                margin: 10px 0;
            ">
                <div style="background: rgba(255,255,255,0.2); padding: 8px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 18px;">👁️</div>
                    <div style="font-size: 12px; font-weight: bold;">${bench.ratings.views}/5</div>
                </div>
                <div style="background: rgba(255,255,255,0.2); padding: 8px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 18px;">🔒</div>
                    <div style="font-size: 12px; font-weight: bold;">${bench.ratings.privacy}/5</div>
                </div>
                <div style="background: rgba(255,255,255,0.2); padding: 8px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 18px;">🪑</div>
                    <div style="font-size: 12px; font-weight: bold;">${bench.ratings.comfort}/5</div>
                </div>
            </div>
            <a href="../pages/bench-card.html?id=${bench.id}" style="
                display: inline-block;
                background: white;
                color: #16a34a;
                padding: 8px 12px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: bold;
                font-size: 12px;
                margin-top: 10px;
                transition: all 0.3s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Ver Detalles →
            </a>
        </div>
    `;
}

// Uso en loadBenches():
// marker.bindPopup(createCustomPopup(bench));

// ============================================
// 8. EXPORTAR MAPA COMO IMAGEN
// ============================================

// Necesita: npm install leaflet-image
// O: <script src="https://unpkg.com/leaflet-image@0.2.4/dist/leaflet-image.umd.js"></script>

function exportMapAsImage(mapInstance) {
    leafletImage(mapInstance, function(err, canvas) {
        if (err) return;
        
        // Crear link de descarga
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'mapa-benchify.png';
        link.click();
    });
}

// Uso:
// exportMapAsImage(map);

// ============================================
// 9. MODO OSCURO PARA EL MAPA
// ============================================

function toggleDarkMode(mapInstance) {
    // Remover capa actual
    mapInstance.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
            mapInstance.removeLayer(layer);
        }
    });
    
    // Añadir capa oscura
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
        maxZoom: 20,
        className: 'dark-mode'
    }).addTo(mapInstance);
    
    // Aplicar CSS de modo oscuro
    document.getElementById('map').style.filter = 'invert(0.93) hue-rotate(180deg)';
}

// Uso:
// toggleDarkMode(map);

// ============================================
// 10. LISTADO DE BANCOS CON TABLA
// ============================================

function displayBenchesTable(benchesArray) {
    let html = `
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead style="background: #16a34a; color: white;">
                <tr>
                    <th style="padding: 10px; text-align: left;">Nombre</th>
                    <th style="padding: 10px;">⭐ Vistas</th>
                    <th style="padding: 10px;">🔒 Privacía</th>
                    <th style="padding: 10px;">🪑 Comodidad</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    benchesArray.forEach((bench, idx) => {
        const bgColor = idx % 2 === 0 ? '#f9fafb' : 'white';
        html += `
            <tr style="background: ${bgColor}; border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px;">${bench.name}</td>
                <td style="padding: 10px; text-align: center;">${bench.ratings.views}</td>
                <td style="padding: 10px; text-align: center;">${bench.ratings.privacy}</td>
                <td style="padding: 10px; text-align: center;">${bench.ratings.comfort}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    return html;
}

// Uso:
// document.getElementById('tabla').innerHTML = displayBenchesTable(benchesData);

// ============================================
// FUNCIONES AUXILIARES NECESARIAS
// ============================================

function calculateDistance(coord1, coord2) {
    const R = 6371;
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLng = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(2);
}

// ============================================
// NOTAS IMPORTANTES
// ============================================

/*
1. PARA USAR ALGUNOS DE ESTOS EJEMPLOS NECESITARÁS:
   - Leaflet Routing Machine (rutas)
   - Leaflet MarkerCluster (clustering)
   - Leaflet Heat (mapas de calor)
   - Leaflet Image (exportar como imagen)

2. TODOS LOS EJEMPLOS ESTÁN DOCUMENTADOS ARRIBA

3. COPIA Y PEGA EL CÓDIGO QUE NECESITES EN maps.js

4. RECUERDA ACTUALIZAR LAS RUTAS DE ARCHIVOS SEGÚN TU ESTRUCTURA

5. PARA CONSULTAS DE FIREBASE USA: database-integration.js
*/
