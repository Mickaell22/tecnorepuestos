import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const metricas = [
  { label: 'Total Productos', valor: '48', sub: 'en inventario', color: '#1e3a5f', icon: 'P' },
  { label: 'Ventas del Dia', valor: '$1,240.00', sub: '7 transacciones hoy', color: '#1a7f4e', icon: 'V' },
  { label: 'Alertas de Stock', valor: '3', sub: 'productos bajo minimo', color: '#c0392b', icon: 'A' },
  { label: 'Proveedores', valor: '6', sub: 'registrados', color: '#7d3c98', icon: 'R' },
];

const alertasStock = [
  { nombre: 'Cargador 65W USB-C', stock: 8, minimo: 20, categoria: 'Cargadores' },
  { nombre: 'Audifonos Bluetooth Pro', stock: 0, minimo: 10, categoria: 'Audio' },
  { nombre: 'Cable HDMI 2m 4K', stock: 5, minimo: 15, categoria: 'Cables' },
];

const ventasRecientes = [
  { id: 'V-001', cliente: 'Marco Salazar', monto: '$245.00', fecha: '16/05/2026', estado: 'Completada' },
  { id: 'V-002', cliente: 'Ana Torres', monto: '$89.50', fecha: '16/05/2026', estado: 'Completada' },
  { id: 'V-003', cliente: 'Luis Paredes', monto: '$412.00', fecha: '15/05/2026', estado: 'Completada' },
];

const s = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '18px',
    marginBottom: '28px',
  },
  card: {
    background: '#fff',
    borderRadius: '10px',
    padding: '20px 22px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderTop: '4px solid',
  },
  cardIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '12px',
  },
  cardValor: {
    fontSize: '1.7rem',
    fontWeight: '800',
    color: '#1e3a5f',
  },
  cardLabel: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#7a8fa6',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  },
  cardSub: {
    fontSize: '0.78rem',
    color: '#a0b0c0',
    marginTop: '4px',
  },
  section: {
    background: '#fff',
    borderRadius: '10px',
    padding: '22px 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: '16px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eef2f7',
  },
  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  badge: (color) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    background: color === 'red' ? '#fdf0f0' : color === 'green' ? '#f0fdf4' : '#f0f4f8',
    color: color === 'red' ? '#c0392b' : color === 'green' ? '#1a7f4e' : '#1e3a5f',
  }),
  welcome: {
    background: 'linear-gradient(135deg, #1e3a5f, #2a5298)',
    color: '#fff',
    borderRadius: '10px',
    padding: '20px 24px',
    marginBottom: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeText: {
    fontSize: '1.1rem',
    fontWeight: '700',
  },
  welcomeSub: {
    fontSize: '0.85rem',
    opacity: 0.75,
    marginTop: '4px',
  },
};

export default function Dashboard() {
  const { usuario } = useAuth();
  const fecha = new Date().toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Layout title="Dashboard">
      <div style={s.welcome}>
        <div>
          <div style={s.welcomeText}>Bienvenido, {usuario?.nombre || 'Usuario'}</div>
          <div style={s.welcomeSub}>{fecha}</div>
        </div>
        <div style={{ fontSize: '0.85rem', opacity: 0.8, textTransform: 'capitalize' }}>
          Rol: {usuario?.rol}
        </div>
      </div>

      <div style={s.grid}>
        {metricas.map((m) => (
          <div key={m.label} style={{ ...s.card, borderTopColor: m.color }}>
            <div style={{ ...s.cardIcon, background: m.color }}>{m.icon}</div>
            <div style={s.cardLabel}>{m.label}</div>
            <div style={s.cardValor}>{m.valor}</div>
            <div style={s.cardSub}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={s.row2}>
        <div style={s.section}>
          <div style={s.sectionTitle}>Alertas de Stock Minimo</div>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Stock</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {alertasStock.map((p) => (
                <tr key={p.nombre}>
                  <td>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{p.nombre}</div>
                    <div style={{ fontSize: '0.75rem', color: '#7a8fa6' }}>{p.categoria}</div>
                  </td>
                  <td style={{ fontWeight: '700' }}>{p.stock}</td>
                  <td>
                    <span style={s.badge(p.stock === 0 ? 'red' : 'orange')}>
                      {p.stock === 0 ? 'Sin stock' : 'Stock bajo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>Ventas Recientes</div>
          <table>
            <thead>
              <tr>
                <th>Venta</th>
                <th>Cliente</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {ventasRecientes.map((v) => (
                <tr key={v.id}>
                  <td>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#2a5298' }}>{v.id}</div>
                    <div style={{ fontSize: '0.75rem', color: '#7a8fa6' }}>{v.fecha}</div>
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>{v.cliente}</td>
                  <td style={{ fontWeight: '700', color: '#1a7f4e' }}>{v.monto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
