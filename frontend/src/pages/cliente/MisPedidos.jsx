import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';

const s = {
  page: {
    minHeight: '100vh',
    background: '#f0f4f8',
  },
  header: {
    background: '#1e3a5f',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBrand: { color: '#fff', fontWeight: '800', fontSize: '1.1rem' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  userName: { color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', fontWeight: '600' },
  logoutBtn: {
    padding: '7px 16px',
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: '6px',
    fontSize: '0.82rem',
    cursor: 'pointer',
  },
  content: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
  heading: { fontSize: '1.3rem', fontWeight: '800', color: '#1e3a5f', marginBottom: '6px' },
  subheading: { fontSize: '0.88rem', color: '#7a8fa6', marginBottom: '24px' },
  card: {
    background: '#fff',
    borderRadius: '10px',
    padding: '20px 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    borderLeft: '4px solid #2a5298',
    transition: 'box-shadow 0.15s',
  },
  cardLeft: {},
  cardNumero: { fontWeight: '800', color: '#2a5298', fontFamily: 'monospace', fontSize: '1rem', marginBottom: '4px' },
  cardFecha: { fontSize: '0.82rem', color: '#a0b0c0' },
  cardRight: { textAlign: 'right' },
  cardTotal: { fontWeight: '800', color: '#1a7f4e', fontSize: '1.1rem' },
  badge: (estado) => ({
    display: 'inline-block',
    background: estado === 'confirmada' ? '#f0fdf4' : '#fff8e1',
    color: estado === 'confirmada' ? '#1a7f4e' : '#d4920a',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    marginTop: '4px',
  }),
  verBtn: { fontSize: '0.82rem', color: '#2a5298', fontWeight: '600' },
  errorBox: { background: '#fff0f0', border: '1px solid #f5c2c2', color: '#c0392b', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.88rem' },
};

const formatFecha = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-EC');
};

export default function MisPedidos() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuario?.id) return;
    const cargar = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/clientes/${usuario.id}/ventas`);
        setPedidos(res.data);
      } catch (err) {
        setError('No se pudieron cargar los pedidos. Verifique la conexion con el servidor.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [usuario]);

  const handleLogout = () => {
    logout();
    navigate('/cliente/login');
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.headerBrand}>TecnoRepuestos S.A.</div>
          <div style={s.headerSub}>Portal del Cliente</div>
        </div>
        <div style={s.headerRight}>
          <span style={s.userName}>{usuario?.nombre}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Cerrar sesion</button>
        </div>
      </div>

      <div style={s.content}>
        <div style={s.heading}>Mis Pedidos</div>
        <div style={s.subheading}>Historial de compras realizadas en TecnoRepuestos S.A.</div>

        {error && <div style={s.errorBox}>{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', color: '#a0b0c0', padding: '40px' }}>Cargando pedidos...</div>
        ) : pedidos.length === 0 ? (
          <div style={{ ...s.card, cursor: 'default', justifyContent: 'center', color: '#7a8fa6' }}>
            No tienes pedidos registrados.
          </div>
        ) : pedidos.map((p) => {
          const totalItems = (p.DetalleVentas || []).reduce((a, d) => a + d.cantidad, 0);
          return (
            <div
              key={p.id}
              style={s.card}
              role="button"
              tabIndex={0}
              aria-label={`Ver detalle del pedido #${p.id}`}
              onClick={() => navigate(`/cliente/pedidos/${p.id}`)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(`/cliente/pedidos/${p.id}`)}
            >
              <div style={s.cardLeft}>
                <div style={s.cardNumero}>Pedido #{p.id}</div>
                <div style={s.cardFecha}>{formatFecha(p.createdAt)}</div>
                <span style={s.badge(p.estado)}>{p.estado}</span>
              </div>
              <div style={s.cardRight}>
                <div style={s.cardTotal}>${parseFloat(p.total).toFixed(2)}</div>
                <div style={{ fontSize: '0.78rem', color: '#a0b0c0', marginBottom: '4px' }}>
                  {totalItems} producto{totalItems !== 1 ? 's' : ''}
                </div>
                <div style={s.verBtn}>Ver detalle &rarr;</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
