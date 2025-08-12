// JavaScript específico para la página index (Dashboard)

// Variables globales para el dashboard
let dashboardData = {
    reservasActivas: 24,
    habitacionesOcupadas: 18,
    checkinHoy: 6,
    checkoutHoy: 12
};

let refreshInterval;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

// ============================================================================
// INICIALIZACIÓN DEL DASHBOARD
// ============================================================================

function initDashboard() {
    setupDashboardEvents();
    loadDashboardData();
    startAutoRefresh();
    animateStatsOnLoad();
    
    console.log('Dashboard inicializado correctamente');
}

function setupDashboardEvents() {
    // Event listeners para las tarjetas de estadísticas
    setupStatCards();
    
    // Event listeners para acciones rápidas
    setupQuickActions();
    
    // Event listeners para el modal
    setupModalEvents();
    
    // Configurar fechas mínimas para el formulario de reserva rápida
    setupDateConstraints();
}

// ============================================================================
// GESTIÓN DE ESTADÍSTICAS
// ============================================================================

function setupStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const statType = this.dataset.stat;
            showStatDetails(statType);
        });
        
        // Efecto hover mejorado
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function showStatDetails(statType) {
    const details = {
        reservas: {
            title: 'Reservas Activas',
            content: `
                <div class="stat-detail">
                    <h4>Detalles de Reservas</h4>
                    <ul>
                        <li>Confirmadas: 20</li>
                        <li>Pendientes: 3</li>
                        <li>En proceso: 1</li>
                    </ul>
                    <p>Total de ingresos estimados: ${HotelBase.formatCurrency(15800)}</p>
                </div>
            `
        },
        habitaciones: {
            title: 'Habitaciones Ocupadas',
            content: `
                <div class="stat-detail">
                    <h4>Estado de Ocupación</h4>
                    <ul>
                        <li>Ocupadas: 18 de 30</li>
                        <li>Disponibles: 12</li>
                        <li>En mantenimiento: 0</li>
                    </ul>
                    <p>Tasa de ocupación: 60%</p>
                </div>
            `
        },
        checkins: {
            title: 'Check-ins de Hoy',
            content: `
                <div class="stat-detail">
                    <h4>Check-ins Programados</h4>
                    <ul>
                        <li>Completados: 4</li>
                        <li>Pendientes: 2</li>
                        <li>Tardíos: 0</li>
                    </ul>
                    <p>Hora promedio de check-in: 15:30</p>
                </div>
            `
        },
        checkouts: {
            title: 'Check-outs de Hoy',
            content: `
                <div class="stat-detail">
                    <h4>Check-outs Programados</h4>
                    <ul>
                        <li>Completados: 8</li>
                        <li>Pendientes: 4</li>
                        <li>Cancelados: 1</li>
                    </ul>
                    <p>Hora promedio de check-out: 11:15</p>
                </div>
            `
        }
    };
    
    const detail = details[statType];
    if (detail) {
        showStatModal(detail.title, detail.content);
    }
}

function showStatModal(title, content) {
    HotelBase.showConfirmDialog(
        title,
        content,
        function() {
            // Acción al confirmar (opcional)
        },
        function() {
            // Acción al cancelar (opcional)
        }
    );
}

function animateStatsOnLoad() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((element, index) => {
        const finalValue = parseInt(element.textContent);
        element.textContent = '0';
        
        setTimeout(() => {
            animateCounter(element, 0, finalValue, 1500);
        }, index * 200);
    });
}

function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// ============================================================================
// GESTIÓN DE DATOS DEL DASHBOARD
// ============================================================================

function loadDashboardData() {
    // Simular carga de datos (en producción sería una llamada AJAX)
    showLoadingState();
    
    setTimeout(() => {
        updateDashboardStats();
        updateRecentActivity();
        hideLoadingState();
    }, 1000);
}

function updateDashboardStats() {
    // Simular datos actualizados
    dashboardData = {
        reservasActivas: Math.floor(Math.random() * 20) + 20,
        habitacionesOcupadas: Math.floor(Math.random() * 15) + 15,
        checkinHoy: Math.floor(Math.random() * 10) + 3,
        checkoutHoy: Math.floor(Math.random() * 15) + 8
    };
    
    // Actualizar los elementos (comentado para mantener valores estáticos en demo)
    // document.getElementById('reservasActivas').textContent = dashboardData.reservasActivas;
    // document.getElementById('habitacionesOcupadas').textContent = dashboardData.habitacionesOcupadas;
    // document.getElementById('checkinHoy').textContent = dashboardData.checkinHoy;
    // document.getElementById('checkoutHoy').textContent = dashboardData.checkoutHoy;
    
    console.log('Estadísticas actualizadas:', dashboardData);
}

function updateRecentActivity() {
    // En una aplicación real, esto cargaría datos desde el servidor
    const activityList = document.getElementById('activityList');
    
    // Aquí podrías hacer una petición AJAX para obtener actividad reciente
    // const activities = await HotelBase.makeRequest('/api/recent-activity');
    // renderActivityItems(activities);
    
    console.log('Actividad reciente actualizada');
}

function showLoadingState() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => card.classList.add('loading'));
}

function hideLoadingState() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => card.classList.remove('loading'));
}

// ============================================================================
// AUTO-REFRESH DEL DASHBOARD
// ============================================================================

function startAutoRefresh() {
    // Refrescar cada 5 minutos (300000 ms)
    refreshInterval = setInterval(refreshDashboard, 300000);
    console.log('Auto-refresh iniciado (cada 5 minutos)');
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
        console.log('Auto-refresh detenido');
    }
}

function refreshDashboard() {
    const refreshIcon = document.querySelector('.refresh-icon');
    if (refreshIcon) {
        refreshIcon.classList.add('spinning');
    }
    
    HotelBase.showNotification('Actualizando datos del dashboard...', 'info');
    
    loadDashboardData();
    
    setTimeout(() => {
        if (refreshIcon) {
            refreshIcon.classList.remove('spinning');
        }
        HotelBase.showNotification('Dashboard actualizado correctamente', 'success');
    }, 1000);
}

// ============================================================================
// ACCIONES RÁPIDAS
// ============================================================================

function setupQuickActions() {
    // Ya están configuradas en el HTML con onclick, pero aquí se pueden agregar más
    console.log('Acciones rápidas configuradas');
}

function showQuickStats() {
    const statsContent = `
        <div class="quick-stats">
            <h4>Resumen Rápido</h4>
            <div class="stats-summary">
                <div class="summary-item">
                    <strong>Ingresos del día:</strong> ${HotelBase.formatCurrency(2850)}
                </div>
                <div class="summary-item">
                    <strong>Ocupación promedio:</strong> 65%
                </div>
                <div class="summary-item">
                    <strong>Reservas para mañana:</strong> 8
                </div>
                <div class="summary-item">
                    <strong>Habitaciones en mantenimiento:</strong> 2
                </div>
            </div>
        </div>
    `;
    
    showStatModal('Estadísticas Rápidas', statsContent);
}

function showReportsModal() {
    HotelBase.showNotification('Módulo de reportes en desarrollo', 'info');
    // Aquí podrías abrir un modal con opciones de reportes
}

// ============================================================================
// MODAL DE NUEVA RESERVA RÁPIDA
// ============================================================================

function setupModalEvents() {
    // Event listener para cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Event listener para cerrar modal clickeando fuera
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target.id);
        }
    });
}

function showNewReservationModal() {
    const modal = document.getElementById('quickReservationModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Focus en el primer input
        setTimeout(() => {
            const firstInput = modal.querySelector('input[name="huesped"]');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        
        // Limpiar formulario si es el modal de reserva
        if (modalId === 'quickReservationModal') {
            const form = document.getElementById('quickReservationForm');
            if (form) form.reset();
        }
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

function setupDateConstraints() {
    const checkinInput = document.querySelector('input[name="checkin"]');
    const checkoutInput = document.querySelector('input[name="checkout"]');
    
    if (checkinInput && checkoutInput) {
        // Establecer fecha mínima como hoy
        const today = new Date().toISOString().split('T')[0];
        checkinInput.min = today;
        
        // Actualizar fecha mínima de checkout cuando cambie checkin
        checkinInput.addEventListener('change', function() {
            const checkinDate = new Date(this.value);
            checkinDate.setDate(checkinDate.getDate() + 1);
            checkoutInput.min = checkinDate.toISOString().split('T')[0];
            
            // Si checkout es anterior a checkin + 1, actualizarlo
            if (checkoutInput.value && checkoutInput.value <= this.value) {
                checkoutInput.value = checkinDate.toISOString().split('T')[0];
            }
        });
    }
}

function createQuickReservation() {
    const form = document.getElementById('quickReservationForm');
    if (!form) return;
    
    // Validar formulario
    const validationRules = {
        huesped: { 
            required: 'El nombre del huésped es obligatorio',
            minLength: 3
        },
        telefono: { 
            required: 'El teléfono es obligatorio',
            phone: true
        },
        checkin: { 
            required: 'La fecha de check-in es obligatoria'
        },
        checkout: { 
            required: 'La fecha de check-out es obligatoria'
        },
        tipoHabitacion: { 
            required: 'Debe seleccionar un tipo de habitación'
        }
    };
    
    if (!HotelBase.validateForm('quickReservationForm', validationRules)) {
        return;
    }
    
    // Obtener datos del formulario
    const formData = new FormData(form);
    const reservationData = {
        huesped: formData.get('huesped'),
        telefono: formData.get('telefono'),
        checkin: formData.get('checkin'),
        checkout: formData.get('checkout'),
        tipoHabitacion: formData.get('tipoHabitacion'),
        fechaRegistro: new Date().toISOString().split('T')[0],
        estado: 'confirmada'
    };
    
    // Mostrar loading
    const submitBtn = document.querySelector('#quickReservationModal .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creando...';
    submitBtn.disabled = true;
    
    // Simular creación de reserva (en producción sería una petición AJAX)
    setTimeout(() => {
        // Aquí harías la petición al servidor
        // const result = await HotelBase.makeRequest('/api/reservas', {
        //     method: 'POST',
        //     body: JSON.stringify(reservationData)
        // });
        
        // Simular éxito
        HotelBase.showNotification(
            `Reserva creada correctamente para ${reservationData.huesped}`,
            'success'
        );
        
        // Cerrar modal y resetear formulario
        closeModal('quickReservationModal');
        
        // Actualizar dashboard
        refreshDashboard();
        
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

// ============================================================================
// UTILIDADES ESPECÍFICAS DEL DASHBOARD
// ============================================================================

function exportDashboardData() {
    const data = {
        fecha: new Date().toISOString().split('T')[0],
        estadisticas: dashboardData,
        resumen: {
            ocupacion: Math.round((dashboardData.habitacionesOcupadas / 30) * 100),
            ingresosDia: 2850,
            promedioEstadia: 2.3
        }
    };
    
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-${data.fecha}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    HotelBase.showNotification('Datos exportados correctamente', 'success');
}

function printDashboard() {
    // Crear una versión imprimible del dashboard
    const printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Dashboard Hotelero - ${HotelBase.formatDate(new Date())}</h1>
            <div style="margin: 20px 0;">
                <h2>Estadísticas Principales</h2>
                <ul>
                    <li>Reservas Activas: ${dashboardData.reservasActivas}</li>
                    <li>Habitaciones Ocupadas: ${dashboardData.habitacionesOcupadas}</li>
                    <li>Check-ins Hoy: ${dashboardData.checkinHoy}</li>
                    <li>Check-outs Hoy: ${dashboardData.checkoutHoy}</li>
                </ul>
            </div>
            <div style="margin: 20px 0;">
                <h2>Resumen</h2>
                <p>Tasa de Ocupación: ${Math.round((dashboardData.habitacionesOcupadas / 30) * 100)}%</p>
                <p>Generado el: ${new Date().toLocaleString('es-ES')}</p>
            </div>
        </div>
    `;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// ============================================================================
// CLEANUP AL SALIR DE LA PÁGINA
// ============================================================================

window.addEventListener('beforeunload', function() {
    stopAutoRefresh();
});

// ============================================================================
// FUNCIONES GLOBALES PARA EL DASHBOARD
// ============================================================================

// Hacer disponibles algunas funciones globalmente para uso desde HTML
window.DashboardApp = {
    refreshDashboard,
    showQuickStats,
    showReportsModal,
    showNewReservationModal,
    closeModal,
    createQuickReservation,
    exportDashboardData,
    printDashboard
};