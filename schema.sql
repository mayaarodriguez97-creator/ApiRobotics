-- Database Schema for API ROBOTICS Operational Hub
-- Target: PostgreSQL

-- Table: fundos (Farms)
CREATE TABLE fundos (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(255),
    estado_contrato VARCHAR(20) DEFAULT 'activo',
    total_colmenas INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: colmenas (Hives)
CREATE TABLE colmenas (
    id VARCHAR(50) PRIMARY KEY,
    fundo_id VARCHAR(50) REFERENCES fundos(id),
    bateria INTEGER CHECK (bateria >= 0 AND bateria <= 100),
    temperatura DECIMAL(5,2),
    humedad DECIMAL(5,2),
    estado VARCHAR(20) DEFAULT 'activo', -- 'activo', 'alerta', 'offline'
    ultima_conexion TIMESTAMP WITH TIME ZONE,
    latitud DECIMAL(9,6),
    longitud DECIMAL(9,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: alertas_criticas (Critical Alerts)
CREATE TABLE alertas_criticas (
    id SERIAL PRIMARY KEY,
    colmena_id VARCHAR(50) REFERENCES colmenas(id),
    tipo VARCHAR(20) NOT NULL, -- 'critica', 'advertencia'
    mensaje TEXT NOT NULL,
    visto BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: operarios (Field Operators)
CREATE TABLE operarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'disponible'
);

-- Table: tareas (Tasks)
CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    operario_id INTEGER REFERENCES operarios(id),
    colmena_id VARCHAR(50) REFERENCES colmenas(id),
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_limite TIMESTAMP WITH TIME ZONE
);
