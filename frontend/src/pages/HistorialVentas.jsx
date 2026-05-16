import { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import api from '../services/api.js';

const s = {
  toolbar: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  searchInput: { flex: 1, maxWidth: '300px' },
  section: { background: '#fff', borderRadius: '10px', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  resumen: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '20px',
  },
  resCard: {
    background: '#fff',
    borderRadius: '10px',
    padding: '16px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderLeft: '4px solid #1e3a5f',
  },
  resLabel: { fontSize: '0.78rem', color: '#7a8fa6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' },
  resValor: { fontSize: '1.5rem', fontWeight: '800', color: '#1e3a5f' },
  errorBox: { background: '#fff0f0', border: '1px solid #f5c2c2', color: '#c0392b', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.88rem' },
};

const estadoBadge = (estado) => {
  if (estado === 'confirmada') return { background: '#f0fdf4', color: '#1a7f4e', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' };
  return { background: '#fdf0f0', color: '#c0392b', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' };
};

export default function HistorialVentas() {
  const [ventas, setVentas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarVentas = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (desde) params.desde = desde;
      if (hasta) params.hasta = hasta;
      const res = await api.get('/ventas', { params });
      setVentas(res.data);
    } catch (err) {
      setError('No se pudo cargar el historial de ventas. Verifique la conexion con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarVentas(); }, []);

  const filtradas = ventas.filter((v) => {
    const nombre = v.Cliente?.nombre || '';
    return nombre.toLowerCase().includes(busqueda.toLowerCase());
  });

  const totalPeriodo = filtradas.reduce((a, v) => a + parseFloat(v.total), 0);

  const formatFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-EC');
  };

  const formatHora = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout title="Historial de Ventas">
      {error && <div style={s.errorBox}>{error}</div>}

      <div style={s.resumen}>
        <div style={s.resCard}>
          <div style={s.resLabel}>Transacciones</div>
          <div style={s.resValor}>{filtradas.length}</div>
        </div>
        <div style={{ ...s.resCard, borderLeftColor: '#1a7f4e' }}>
          <div style={s.resLabel}>Ingresos totales</div>
          <div style={{ ...s.resValor, color: '#1a7f4e' }}>${totalPeriodo.toFixed(2)}</div>
        </div>
        <div style={{ ...s.resCard, borderLeftColor: '#7d3c98' }}>
          <div style={s.resLabel}>Estado</div>
          <div style={{ ...s.resValor, color: '#7d3c98', fontSize: '1rem' }}>
            {filtradas.filter((v) => v.estado === 'confirmada').length} confirmadas
          </div>
        </div>
      </div>

      <div style={s.toolbar}>
        <div style={s.searchInput}>
          <input
            aria-label="Buscar en historial por cliente"
            placeholder="Buscar por cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="filtro-desde" style={{ whiteSpace: 'nowrap', marginBottom: 0, fontSize: '0.85rem' }}>Desde:</label>
          <input id="filtro-desde" type="date" style={{ width: '140px' }} value={desde} onChange={(e) => setDesde(e.target.value)} />
          <label htmlFor="filtro-hasta" style={{ whiteSpace: 'nowrap', marginBottom: 0, fontSize: '0.85rem' }}>Hasta:</label>
          <input id="filtro-hasta" type="date" style={{ width: '140px' }} value={hasta} onChange={(e) => setHasta(e.target.value)} />
          <button
            style={{ padding: '7px 14px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
            onClick={cargarVentas}
          >
            Filtrar
          </button>
        </div>
      </div>

      <div style={s.section}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#a0b0c0', padding: '40px' }}>Cargando historial...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha / Hora</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#a0b0c0', padding: '24px' }}>Sin resultados</td></tr>
              ) : filtradas.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontWeight: '700', color: '#2a5298', fontFamily: 'monospace' }}>#{v.id}</td>
                  <td style={{ fontWeight: '600' }}>{v.Cliente?.nombre || '—'}</td>
                  <td>
                    <div style={{ fontSize: '0.88rem' }}>{formatFecha(v.createdAt)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#a0b0c0' }}>{formatHora(v.createdAt)}</div>
                  </td>
                  <td style={{ fontWeight: '700', color: '#1a7f4e' }}>${parseFloat(v.total).toFixed(2)}</td>
                  <td><span style={estadoBadge(v.estado)}>{v.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
