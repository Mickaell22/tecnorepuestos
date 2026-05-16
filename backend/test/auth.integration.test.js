const request = require('supertest');
const express = require('express');

// App mínima para la prueba de integración (sin BD real)
const app = express();
app.use(express.json());

// Simulamos el endpoint de login con lógica básica
app.post('/api/auth/login', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
  }

  // Usuario de prueba hardcodeado para el test de integración
  if (correo === 'admin@tecnorepuestos.com' && contrasena === 'Admin2025!') {
    return res.status(200).json({ token: 'token-de-prueba', rol: 'administrador' });
  }

  return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
});

// --- Pruebas de integración: POST /api/auth/login ---

describe('POST /api/auth/login', () => {
  test('responde 200 y devuelve token con credenciales correctas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'admin@tecnorepuestos.com', contrasena: 'Admin2025!' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('rol', 'administrador');
  });

  test('responde 401 con credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'admin@tecnorepuestos.com', contrasena: 'clave-incorrecta' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('mensaje');
  });

  test('responde 400 si faltan campos obligatorios', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'admin@tecnorepuestos.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('mensaje');
  });
});
