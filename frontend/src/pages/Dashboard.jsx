import { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

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
  errorBox: {
    background: '#fff0f0',
    border: '1px solid #f5c2c2',
    color: '#c0392b',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '0.88rem',
  },
};

export default function Dashboard() {
  const { usuario } = useAuth();
  const fecha = new Date().toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const [inventario, setInventario] = useState(null);
  const [reporteVentas, setReporteVentas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError('');
      try {
        const hoy = new Date().toISOString().split('T')[0];
        const [resInv, resVentas] = await Promise.all([
          api.get('/reportes/inventario'),
          api.get('/reportes/ventas', { params: { desde: hoy, hasta: hoy } }),
        ]);
        setInventario(resInv.data);
        setReporteVentas(resVentas.data);
      } catch (err) {
        setError('No se pudieron cargar los datos del dashboard. Verifique la conexion con el servidor.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const metricas = [
    {
      label: 'Total Productos',
      valor: loading ? '...' : String(inventario?.resumen?.total || 0),
      sub: 'en inventario',
      color: '#1e3a5f',
      icon: 'P',
    },
    {
      label: 'Ventas del Dia',
      valor: loading ? '...' : `$${(reporteVentas?.totalIngresos || 0).toFixed(2)}`,
      sub: `${reporteVentas?.totalTransacciones || 0} transacciones hoy`,
      color: '#1a7f4e',
      icon: 'V',
    },
    {
      label: 'Alertas de Stock',
      valor: loading ? '...' : String((inventario?.resumen?.sinStock || 0) + (inventario?.resumen?.bajoMinimo || 0)),
      sub: 'productos bajo minimo o sin stock',
      color: '#c0392b',
      icon: 'A',
    },
    {
      label: 'Sin Stock',
      valor: loading ? '...' : String(inventario?.resumen?.sinStock || 0),
      sub: 'productos agotados',
      color: '#7d3c98',
      icon: 'S',
    },
  ];

  const alertasStock = (inventario?.productos || []).filter(
    (p) => p.estado === 'sin_stock' || p.estado === 'bajo_minimo'
  ).slice(0, 5);

  const ventasRecientes = (reporteVentas?.ventas || []).slice(0, 5);

  const formatFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-EC');
  };

  return (
    <Layout title="Dashboard">
      {error && <div style={s.errorBox}>{error}</div>}

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
          <div style={s.sectionTitle}>Alertas de Stock</div>
          {loading ? (
            <div style={{ color: '#a0b0c0', fontSize: '0.88rem' }}>Cargando...</div>
          ) : alertasStock.length === 0 ? (
            <div style={{ color: '#1a7f4e', fontSize: '0.88rem' }}>Todos los productos tienen stock normal.</div>
          ) : (
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
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{p.nombre}</div>
                      <div style={{ fontSize: '0.75rem', color: '#7a8fa6' }}>{p.categoria}</div>
                    </td>
                    <td style={{ fontWeight: '700' }}>{p.stock_actual}</td>
                    <td>
                      <span style={s.badge(p.estado === 'sin_stock' ? 'red' : 'orange')}>
                        {p.estado === 'sin_stock' ? 'Sin stock' : 'Stock bajo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>Ventas de Hoy</div>
          {loading ? (
            <div style={{ color: '#a0b0c0', fontSize: '0.88rem' }}>Cargando...</div>
          ) : ventasRecientes.length === 0 ? (
            <div style={{ color: '#7a8fa6', fontSize: '0.88rem' }}>No hay ventas registradas hoy.</div>
          ) : (
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
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#2a5298' }}>#{v.id}</div>
                      <div style={{ fontSize: '0.75rem', color: '#7a8fa6' }}>{formatFecha(v.createdAt)}</div>
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>{v.Cliente?.nombre || '—'}</td>
                    <td style={{ fontWeight: '700', color: '#1a7f4e' }}>${parseFloat(v.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
