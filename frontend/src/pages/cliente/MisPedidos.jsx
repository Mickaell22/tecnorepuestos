import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { PEDIDOS_MOCK } from '../../data/pedidosMock.js';

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
    background: estado === 'Entregado' ? '#f0fdf4' : '#fff8e1',
    color: estado === 'Entregado' ? '#1a7f4e' : '#d4920a',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    marginTop: '4px',
  }),
  verBtn: { fontSize: '0.82rem', color: '#2a5298', fontWeight: '600' },
};

export default function MisPedidos() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

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
        <div style={s.subheading}>Historial de compras y pedidos realizados en TecnoRepuestos S.A.</div>

        {PEDIDOS_MOCK.map((p) => (
          <div
            key={p.id}
            style={s.card}
            role="button"
            tabIndex={0}
            aria-label={`Ver detalle del pedido ${p.numero}`}
            onClick={() => navigate(`/cliente/pedidos/${p.id}`)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(`/cliente/pedidos/${p.id}`)}
          >
            <div style={s.cardLeft}>
              <div style={s.cardNumero}>{p.numero}</div>
              <div style={s.cardFecha}>{p.fecha} — {p.metodo}</div>
              <span style={s.badge(p.estado)}>{p.estado}</span>
            </div>
            <div style={s.cardRight}>
              <div style={s.cardTotal}>${p.total.toFixed(2)}</div>
              <div style={{ fontSize: '0.78rem', color: '#a0b0c0', marginBottom: '4px' }}>{p.items.length} producto{p.items.length !== 1 ? 's' : ''}</div>
              <div style={s.verBtn}>Ver detalle &rarr;</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
