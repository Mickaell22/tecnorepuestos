# TecnoRepuestos S.A. — Sistema de Gestión

Sistema web para la gestión de inventario, compras, ventas y portal del cliente de TecnoRepuestos S.A.

## Stack tecnológico

- **Frontend:** React JS 18.x + Axios + React Router
- **Backend:** Node.js 20.x + Express 4.x
- **Base de datos:** PostgreSQL 16.x + Sequelize 6.x
- **Autenticación:** JWT + bcrypt
- **Notificaciones:** Nodemailer (SMTP)
- **PDF:** PDFKit

## Estructura del proyecto

```
tecnorepuestos/
├── backend/
│   ├── src/
│   │   ├── config/       # Conexión a la base de datos
│   │   ├── controllers/  # Lógica de cada módulo
│   │   ├── middlewares/  # Autenticación y control de roles
│   │   ├── models/       # Modelos Sequelize
│   │   ├── routes/       # Endpoints de la API
│   │   └── services/     # Correo y generación de PDF
│   ├── db/               # Script de datos iniciales (seed)
│   ├── test/             # Pruebas unitarias e integración
│   ├── .env.example      # Variables de entorno de ejemplo
│   └── index.js          # Punto de entrada del servidor
└── frontend/
    └── src/
        ├── components/   # Componentes reutilizables
        ├── context/      # Estado global de autenticación
        ├── pages/        # Vistas por módulo
        └── services/     # Llamadas a la API (Axios)
```

## Instalación y ejecución

```bash
# Backend
cd backend
cp .env.example .env   # completar variables
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Variables de entorno requeridas

Ver `backend/.env.example` para la lista completa de variables necesarias.
