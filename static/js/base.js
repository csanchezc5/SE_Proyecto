// Funciones base para todas las páginas

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Manejo del botón de logout
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                // Aquí iría la lógica de logout
                showNotification('Sesión cerrada correctamente', 'success');
                // window.location.href = '/logout';
            }
        });
    }
});

// Función para hacer peticiones AJAX
async function apiRequest(url, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        showNotification('Error en la comunicación con el servidor', 'error');
        throw error;
    }
}