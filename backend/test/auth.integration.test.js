require('dotenv').config();
const request = require('supertest');
const express = require('express');

const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL;
const TEST_ADMIN_PASS  = process.env.TEST_ADMIN_PASS;

if (!TEST_ADMIN_EMAIL || !TEST_ADMIN_PASS) {
  throw new Error('Faltan variables de entorno TEST_ADMIN_EMAIL y TEST_ADMIN_PASS en el archivo .env');
}

// App mínima para la prueba de integración (sin BD real)
const app = express();
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
  }

  if (correo === TEST_ADMIN_EMAIL && contrasena === TEST_ADMIN_PASS) {
    return res.status(200).json({ token: 'token-de-prueba', rol: 'administrador' });
  }

  return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
});

// --- Pruebas de integración: POST /api/auth/login ---

describe('POST /api/auth/login', () => {
  test('responde 200 y devuelve token con credenciales correctas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: TEST_ADMIN_EMAIL, contrasena: TEST_ADMIN_PASS });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('rol', 'administrador');
  });

  test('responde 401 con credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: TEST_ADMIN_EMAIL, contrasena: 'clave-incorrecta' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('mensaje');
  });

  test('responde 400 si faltan campos obligatorios', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: TEST_ADMIN_EMAIL });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('mensaje');
  });
});
