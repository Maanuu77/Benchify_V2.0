/**
 * BENCHIFY - SCRIPT PARA AGREGAR NUEVOS BANCOS A FIREBASE
 * Conecta el formulario add-bench.html con la base de datos Firestore
 */

import { saveBench, uploadBenchPhoto, getFriendlyErrorMessage } from '../js/database.js';
import { auth } from '../js/firebase-init.js';

/**
 * Obtener datos del formulario
 */
function getFormData() {
    return {
        nombre: document.getElementById('benchName')?.value || '',
        descripcion: document.getElementById('benchDescription')?.value || '',
        lat: parseFloat(document.getElementById('latitude')?.value || 0),
        lng: parseFloat(document.getElementById('longitude')?.value || 0),
        vistas: parseInt(document.getElementById('vistas')?.value || 0),
        privacidad: parseInt(document.getElementById('privacidad')?.value || 0),
        comodidad: parseInt(document.getElementById('comodidad')?.value || 0),
        atmosfera: parseInt(document.getElementById('atmosfera')?.value || 0),
        etiquetas: Array.from(document.querySelectorAll('input[name="etiquetas"]:checked'))
            .map(el => el.value),
        fotoFile: document.getElementById('benchPhoto')?.files[0] || null
    };
}

/**
 * Validar datos del formulario
 */
function validateForm(data) {
    const errors = [];
    
    if (!data.nombre.trim()) errors.push('El nombre del banco es obligatorio');
    if (!data.descripcion.trim()) errors.push('La descripción es obligatoria');
    if (data.lat === 0 && data.lng === 0) errors.push('Debes seleccionar una ubicación en el mapa');
    if (data.etiquetas.length === 0) errors.push('Debes seleccionar al menos una etiqueta');
    
    return errors;
}

/**
 * Guardar banco en Firebase
 */
async function saveBenchToFirebase(data) {
    try {
        // Validar que el usuario esté autenticado
        if (!auth.currentUser) {
            throw new Error('Debes iniciar sesión para agregar un banco');
        }

        console.log('📤 Iniciando guardado de banco...');
        
        let fotoURL = null;
        if (data.fotoFile) {
            console.log('📸 Subiendo foto...');
            // Usar un ID temporal hasta que se cree el documento
            fotoURL = await uploadBenchPhoto(data.fotoFile, 'temp');
            console.log('✅ Foto subida:', fotoURL);
        }

        // Preparar objeto para Firestore
        const benchData = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            lat: data.lat,
            lng: data.lng,
            vistas: data.vistas,
            privacidad: data.privacidad,
            comodidad: data.comodidad,
            atmosfera: data.atmosfera,
            etiquetas: data.etiquetas,
            fotoURL: fotoURL
        };

        console.log('💾 Guardando banco en Firestore:', benchData);
        const benchId = await saveBench(benchData);
        
        console.log('✅ Banco guardado con ID:', benchId);
        return { success: true, benchId };
    } catch (error) {
        console.error('❌ Error al guardar banco:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Mostrar mensaje de error
 */
function showError(message) {
    const errorDiv = document.getElementById('formError') || createErrorDiv();
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.style.backgroundColor = '#fee2e2';
    errorDiv.style.color = '#991b1b';
    errorDiv.style.padding = '1rem';
    errorDiv.style.borderRadius = '6px';
    errorDiv.style.marginBottom = '1rem';
    errorDiv.style.border = '1px solid #fecaca';
}

/**
 * Mostrar mensaje de éxito
 */
function showSuccess(message) {
    const successDiv = document.getElementById('formError') || createErrorDiv();
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    successDiv.style.backgroundColor = '#dcfce7';
    successDiv.style.color = '#166534';
    successDiv.style.padding = '1rem';
    successDiv.style.borderRadius = '6px';
    successDiv.style.marginBottom = '1rem';
    successDiv.style.border = '1px solid #bbf7d0';
}

/**
 * Crear div para mensajes
 */
function createErrorDiv() {
    const div = document.createElement('div');
    div.id = 'formError';
    const form = document.getElementById('addBenchForm');
    if (form) {
        form.parentNode.insertBefore(div, form);
    }
    return div;
}

/**
 * Manejar envío del formulario
 */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addBenchForm');
    if (!form) {
        console.error('Formulario no encontrado');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Verificar autenticación
        if (!auth.currentUser) {
            showError('❌ Debes iniciar sesión para agregar un banco. Redirigiendo...');
            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 2000);
            return;
        }

        console.log('📝 Obteniendo datos del formulario...');
        const data = getFormData();
        
        console.log('✓ Validando formulario...');
        const errors = validateForm(data);
        if (errors.length > 0) {
            showError('❌ ' + errors.join('\n'));
            return;
        }

        // Desactivar botón durante el envío
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent || 'Guardar';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Guardando...';
        }

        try {
            console.log('🚀 Guardando banco en Firebase...');
            const result = await saveBenchToFirebase(data);

            if (result.success) {
                showSuccess(`✅ ¡Banco creado exitosamente! Redirigiendo al mapa...`);
                
                // Esperar un segundo y redirigir
                setTimeout(() => {
                    window.location.href = 'map.html';
                }, 1500);
            } else {
                showError('❌ ' + (result.error || 'Error desconocido'));
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }
        } catch (error) {
            console.error('❌ Error inesperado:', error);
            showError('❌ ' + getFriendlyErrorMessage(error));
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    });

    console.log('✅ Script de agregar banco inicializado');
});

// Exportar para uso externo
export { getFormData, validateForm, saveBenchToFirebase, showError, showSuccess };
