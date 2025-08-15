# Sistema de Reservas de Hoteles
# 🏨 Sistema de Reservas de Hoteles

<div align="center">

![Hotel Management System](https://img.shields.io/badge/Hotel-Management%20System-blue?style=for-the-badge&logo=hotel)
![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18.0-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)

**Sistema integral para la gestión completa de reservas hoteleras**


</div>

---

## 📋 Tabla de Contenidos

- [📖 Descripción General](#-descripción-general)
- [✨ Características Principales](#-características-principales)
- [🛠️ Tecnologías](#️-tecnologías)
- [📦 Instalación](#-instalación)
- [🎯 Uso](#-uso)
- [👥 Equipo de Desarrollo](#-equipo-de-desarrollo)
- [🗄️ Base de Datos](#️-base-de-datos)
- [🔌 API Reference](#-api-reference)
- [🎨 Screenshots](#-screenshots)
- [🧪 Testing](#-testing)

---

## 📖 Descripción General

El **Sistema de Reservas de Hoteles** es una aplicación web moderna y completa diseñada para automatizar y optimizar la gestión integral de un hotel. Desde el registro de huéspedes hasta la generación de reportes financieros, nuestro sistema ofrece una solución robusta y escalable.

### 🎯 Objetivos del Proyecto

- **Digitalizar** procesos manuales del hotel
- **Automatizar** facturación y reportes
- **Optimizar** la experiencia del usuario
- **Centralizar** información de clientes y reservas
- **Proporcionar** insights de negocio en tiempo real

---

## ✨ Características Principales

<div align="center">

| 🏢 **Gestión Hotelera** | 👥 **Clientes** | 📅 **Reservas** | 💰 **Facturación** |
|:---:|:---:|:---:|:---:|
| Control de habitaciones | Base de datos completa | Sistema inteligente | Automática |
| Estados en tiempo real | Historial detallado | Disponibilidad | Multi-moneda |
| Tipos y precios | Búsqueda avanzada | Modificaciones | Reportes |

</div>

### 🔥 **Funcionalidades Destacadas**

- ✅ **Dashboard Interactivo** con métricas en tiempo real
- ✅ **Sistema de Reservas Inteligente** con validación de disponibilidad
- ✅ **Gestión Completa de Clientes** con historial
- ✅ **Facturación Automática** y control de pagos
- ✅ **Reportes Avanzados** con exportación a Excel/PDF
- ✅ **Interface Moderna y Responsive** para todos los dispositivos
- ✅ **Sistema de Usuarios y Roles** con diferentes niveles de acceso
- ✅ **API RESTful** completamente documentada

---

## 🚀 Demo

<div align="center">

### 🌐 **[Ver Demo en Vivo](https://tu-demo-url.com)** 
*(Usuario: demo@hotel.com | Password: demo123)*

</div>

---

## 🛠️ Tecnologías

### **Frontend**
```json
{
  "framework": "React 18",
  "styling": "CSS3 + Modern Design",
  "state": "React Hooks",
  "routing": "React Router",
  "http": "Axios"
}
```

### **Backend**
```json
{
  "runtime": "Node.js 18",
  "framework": "Express.js",
  "database": "MySQL/PostgreSQL",
  "auth": "JWT",
  "validation": "Joi"
}
```

### **Herramientas de Desarrollo**
![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)
![VSCode](https://img.shields.io/badge/VSCode-007ACC?style=flat&logo=visual-studio-code&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=postman&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)

---

## 📦 Instalación

### **Prerrequisitos**
```bash
node --version  # v18.0.0+
npm --version   # v8.0.0+
mysql --version # v8.0.0+ (opcional: PostgreSQL)
```

### **Pasos de Instalación**

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/sistema-reservas-hotel.git
cd sistema-reservas-hotel
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Instalar dependencias del frontend**
```bash
cd ../frontend
npm install
```

4. **Configurar variables de entorno**
```bash
# Crear archivo .env en /backend
cp .env.example .env

# Editar con tus configuraciones
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=hotel_reservas
JWT_SECRET=tu_jwt_secret_super_seguro
PORT=3001
```

5. **Configurar la base de datos**
```bash
# Ejecutar migraciones
npm run migrate

# Seeders (datos de prueba)
npm run seed
```

6. **Ejecutar el proyecto**
```bash
# Backend (terminal 1)
cd backend && npm run dev

# Frontend (terminal 2) 
cd frontend && npm start
```

7. **¡Listo!** 🎉
```
Frontend: http://localhost:3000
Backend:  http://localhost:3001
API Docs: http://localhost:3001/docs
```

---

## 🎯 Uso

### **Login Inicial**
```
Administrador: admin@hotel.com / admin123
Recepcionista: recepcion@hotel.com / recep123
Contador: contador@hotel.com / conta123
```

### **Flujo Típico de Trabajo**

1. **👤 Registrar Cliente**
   - Ir a "Clientes" → "Nuevo Cliente"
   - Completar información personal
   - Guardar datos

2. **🛏️ Verificar Habitaciones**
   - Consultar disponibilidad
   - Ver tipos y precios
   - Confirmar estado

3. **📅 Crear Reserva**
   - Seleccionar cliente y habitación
   - Definir fechas de estadía
   - Confirmar reserva

4. **💰 Generar Factura**
   - El sistema factura automáticamente
   - Registrar pagos
   - Imprimir comprobantes

---

## 👥 Equipo de Desarrollo

<div align="center">

| Desarrollador | Módulo | GitHub | LinkedIn |
|:---:|:---:|:---:|:---:|
| **Cristhian Sanchez** | Usuarios & Auth | [@cristhian](https://github.com/cristhian) | [LinkedIn](https://linkedin.com/in/cristhian) |
| **Ivan Hernandez** | Clientes | [@ivan](https://github.com/ivan) | [LinkedIn](https://linkedin.com/in/ivan) |
| **Sulay Vergara** | Habitaciones & Reservas | [@sulay](https://github.com/sulay) | [LinkedIn](https://linkedin.com/in/sulay) |
| **David Tunja** | Facturación | [@david](https://github.com/david) | [LinkedIn](https://linkedin.com/in/david) |
| **Joel Mazzini** | Reportes | [@joel](https://github.com/joel) | [LinkedIn](https://linkedin.com/in/joel) |

</div>

---

## 🗄️ Base de Datos

### **Diagrama ERD**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   usuarios  │    │   clientes  │    │habitaciones │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ nombre      │    │ nombre      │    │ numero      │
│ email       │    │ documento   │    │ tipo        │
│ password    │    │ correo      │    │ precio      │
│ rol         │    │ telefono    │    │ estado      │
└─────────────┘    └─────────────┘    └─────────────┘
                          │                   │
                          └─────────┬─────────┘
                                    │
                            ┌─────────────┐
                            │   reservas  │
                            ├─────────────┤
                            │ id (PK)     │
                            │ cliente_id  │
                            │ habitacion_id│
                            │ fecha_inicio│
                            │ fecha_fin   │
                            │ estado      │
                            └─────────────┘
```

### **Tablas Principales**

<details>
<summary><strong>📊 Ver estructura detallada de tablas</strong></summary>

#### `usuarios`
```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'recepcionista', 'contador') DEFAULT 'recepcionista',
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `clientes`
```sql
CREATE TABLE clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  documento_identidad VARCHAR(20) UNIQUE NOT NULL,
  correo VARCHAR(100),
  telefono VARCHAR(20),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `habitaciones`
```sql
CREATE TABLE habitaciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero VARCHAR(10) UNIQUE NOT NULL,
  tipo ENUM('simple', 'doble', 'suite', 'presidencial') NOT NULL,
  precio_noche DECIMAL(10,2) NOT NULL,
  estado ENUM('disponible', 'ocupada', 'mantenimiento') DEFAULT 'disponible',
  descripcion TEXT
);
```

#### `reservas`
```sql
CREATE TABLE reservas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cliente_id INT NOT NULL,
  habitacion_id INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado ENUM('activa', 'cancelada', 'completada') DEFAULT 'activa',
  fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id)
);
```

</details>

---

## 🔌 API Reference

### **Base URL**
```
http://localhost:3001/api
```

### **Autenticación**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@hotel.com",
  "password": "password123"
}
```

### **Endpoints Principales**

<details>
<summary><strong>👥 Clientes</strong></summary>

```http
# Listar todos los clientes
GET /clientes

# Crear nuevo cliente
POST /clientes
{
  "nombre": "Juan Pérez",
  "documento_identidad": "1234567890",
  "correo": "juan@email.com",
  "telefono": "555-0123"
}

# Obtener cliente específico
GET /clientes/{id}

# Actualizar cliente
PUT /clientes/{id}

# Eliminar cliente
DELETE /clientes/{id}
```

</details>

<details>
<summary><strong>🛏️ Habitaciones</strong></summary>

```http
# Listar habitaciones
GET /habitaciones

# Habitaciones disponibles
GET /habitaciones/disponibles?fecha_inicio=2024-01-01&fecha_fin=2024-01-05

# Crear habitación
POST /habitaciones
{
  "numero": "101",
  "tipo": "doble",
  "precio_noche": 150.00,
  "descripcion": "Habitación doble con vista al mar"
}
```

</details>

<details>
<summary><strong>📅 Reservas</strong></summary>

```http
# Crear reserva
POST /reservas
{
  "cliente_id": 1,
  "habitacion_id": 1,
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-01-05"
}

# Listar reservas
GET /reservas?estado=activa&fecha_inicio=2024-01-01

# Cancelar reserva
PUT /reservas/{id}/cancelar
```

</details>

### **Códigos de Respuesta**
```http
200 OK          - Solicitud exitosa
201 Created     - Recurso creado exitosamente
400 Bad Request - Error en los datos enviados
401 Unauthorized - No autenticado
403 Forbidden   - Sin permisos
404 Not Found   - Recurso no encontrado
500 Internal Server Error - Error del servidor
```

---

## 🎨 Screenshots

<div align="center">

### **Dashboard Principal**
![Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=Dashboard+Principal)

### **Gestión de Reservas**
![Reservas](https://via.placeholder.com/800x400/4facfe/ffffff?text=Gestion+de+Reservas)

### **Lista de Clientes**
![Clientes](https://via.placeholder.com/800x400/764ba2/ffffff?text=Lista+de+Clientes)

</div>

---

## 🧪 Testing

### **Ejecutar Tests**
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Coverage
npm run test:coverage
```



</div>