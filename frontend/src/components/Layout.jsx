import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/inventario', label: 'Inventario' },
  { to: '/compras', label: 'Compras' },
  { to: '/ventas', label: 'Ventas' },
  { to: '/historial-ventas', label: 'Historial de Ventas' },
];

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f0f4f8',
  },
  sidebar: {
    width: '240px',
    background: '#1e3a5f',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  brand: {
    padding: '24px 20px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  brandName: {
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: '700',
    letterSpacing: '0.02em',
  },
  brandSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '0.72rem',
    marginTop: '2px',
  },
  nav: {
    flex: 1,
    padding: '16px 0',
  },
  navLink: {
    display: 'block',
    padding: '11px 20px',
    color: 'rgba(255,255,255,0.75)',
    fontSize: '0.9rem',
    transition: 'background 0.15s, color 0.15s',
    borderLeft: '3px solid transparent',
  },
  navLinkActive: {
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    borderLeft: '3px solid #4a9eff',
  },
  userSection: {
    padding: '16px 20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  userName: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  userRole: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '0.75rem',
    marginBottom: '10px',
    textTransform: 'capitalize',
  },
  logoutBtn: {
    width: '100%',
    padding: '8px',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  topbar: {
    background: '#fff',
    padding: '14px 28px',
    borderBottom: '1px solid #dde4ec',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  pageTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#1e3a5f',
  },
  content: {
    flex: 1,
    padding: '28px',
    overflowY: 'auto',
  },
};

export default function Layout({ children, title }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandName}>TecnoRepuestos</div>
          <div style={styles.brandSub}>Sistema de Gestion</div>
        </div>
        <nav style={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={styles.userSection}>
          <div style={styles.userName}>{usuario?.nombre || 'Usuario'}</div>
          <div style={styles.userRole}>{usuario?.rol || 'rol'}</div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Cerrar sesion
          </button>
        </div>
      </aside>
      <div style={styles.main}>
        <div style={styles.topbar}>
          <span style={styles.pageTitle}>{title}</span>
          <span style={{ color: '#7a8fa6', fontSize: '0.85rem' }}>
            TecnoRepuestos S.A.
          </span>
        </div>
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
}
