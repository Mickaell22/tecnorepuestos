import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2a5298 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '44px 40px',
    width: '380px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
  },
  logo: { textAlign: 'center', marginBottom: '28px' },
  logoText: { fontSize: '1.5rem', fontWeight: '800', color: '#1e3a5f' },
  logoSub: { fontSize: '0.8rem', color: '#7a8fa6', marginTop: '2px' },
  portalBadge: {
    display: 'inline-block',
    background: '#eff6ff',
    color: '#2a5298',
    borderRadius: '20px',
    padding: '4px 14px',
    fontSize: '0.78rem',
    fontWeight: '700',
    marginTop: '8px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  heading: { fontSize: '1.05rem', fontWeight: '700', color: '#1e3a5f', marginBottom: '20px', textAlign: 'center' },
  field: { marginBottom: '16px' },
  btn: {
    width: '100%',
    padding: '12px',
    background: '#2a5298',
    color: '#fff',
    border: 'none',
    borderRadius: '7px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    background: '#fff0f0',
    border: '1px solid #f5c2c2',
    color: '#c0392b',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '0.85rem',
    marginBottom: '14px',
  },
  adminLink: { textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#7a8fa6' },
  link: { color: '#2a5298', fontWeight: '600', marginLeft: '4px' },
  hint: {
    background: '#f0f4f8',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '0.78rem',
    color: '#4a6fa5',
    marginTop: '16px',
    lineHeight: '1.6',
  },
};

export default function ClienteLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/cliente/login', { correo: email, contrasena: password });
      const { token, rol, nombre, id } = res.data;
      login({ token, rol, nombre, id });
      navigate('/cliente/pedidos');
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al conectar con el servidor';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <div style={s.logoText}>TecnoRepuestos S.A.</div>
          <div style={s.logoSub}>Portal de Clientes</div>
          <div style={s.portalBadge}>Area de Clientes</div>
        </div>
        <div style={s.heading}>Acceder a mi cuenta</div>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label htmlFor="cli-email">Correo electronico</label>
            <input
              id="cli-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              disabled={loading}
            />
          </div>
          <div style={s.field}>
            <label htmlFor="cli-password">Contrasena</label>
            <input
              id="cli-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Verificando...' : 'Ingresar a mi Portal'}
          </button>
        </form>
        <div style={s.hint}>
          <strong>Demo:</strong><br />
          cliente@correo.com / Cliente2025!
        </div>
        <div style={s.adminLink}>
          Personal del taller?
          <Link to="/login" style={s.link}>Acceder al sistema</Link>
        </div>
      </div>
    </div>
  );
}
