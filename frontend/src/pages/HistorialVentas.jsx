import { useState } from 'react';
import Layout from '../components/Layout.jsx';

const HISTORIAL = [
  { id: 1, numero: 'VT-2026-001', cliente: 'Marco Salazar', fecha: '16/05/2026', hora: '09:14', total: 245.00, items: 4, metodo: 'Tarjeta', vendedor: 'Carlos Mendoza' },
  { id: 2, numero: 'VT-2026-002', cliente: 'Ana Torres', fecha: '16/05/2026', hora: '10:32', total: 89.50, items: 2, metodo: 'Efectivo', vendedor: 'Carlos Mendoza' },
  { id: 3, numero: 'VT-2026-003', cliente: 'Luis Paredes', fecha: '15/05/2026', hora: '14:05', total: 412.00, items: 6, metodo: 'Transferencia', vendedor: 'Administrador' },
  { id: 4, numero: 'VT-2026-004', cliente: 'Carmen Vega', fecha: '14/05/2026', hora: '11:20', total: 127.50, items: 3, metodo: 'Efectivo', vendedor: 'Carlos Mendoza' },
  { id: 5, numero: 'VT-2026-005', cliente: 'Roberto Diaz', fecha: '13/05/2026', hora: '16:45', total: 350.00, items: 5, metodo: 'Tarjeta', vendedor: 'Administrador' },
  { id: 6, numero: 'VT-2026-006', cliente: 'Marco Salazar', fecha: '12/05/2026', hora: '09:58', total: 75.00, items: 2, metodo: 'Efectivo', vendedor: 'Carlos Mendoza' },
  { id: 7, numero: 'VT-2026-007', cliente: 'Ana Torres', fecha: '10/05/2026', hora: '13:30', total: 210.00, items: 4, metodo: 'Transferencia', vendedor: 'Carlos Mendoza' },
];

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
};

const metodoColor = (m) => {
  if (m === 'Efectivo') return { background: '#f0fdf4', color: '#1a7f4e' };
  if (m === 'Tarjeta') return { background: '#eff6ff', color: '#2a5298' };
  return { background: '#fdf4ff', color: '#7d3c98' };
};

export default function HistorialVentas() {
  const [busqueda, setBusqueda] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');

  const filtradas = HISTORIAL.filter((v) => {
    const matchBusq =
      v.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.vendedor.toLowerCase().includes(busqueda.toLowerCase());
    const matchFecha = !fechaFiltro || v.fecha === fechaFiltro;
    return matchBusq && matchFecha;
  });

  const totalPeriodo = filtradas.reduce((a, v) => a + v.total, 0);
  const totalItems = filtradas.reduce((a, v) => a + v.items, 0);

  return (
    <Layout title="Historial de Ventas">
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
          <div style={s.resLabel}>Productos vendidos</div>
          <div style={{ ...s.resValor, color: '#7d3c98' }}>{totalItems}</div>
        </div>
      </div>

      <div style={s.toolbar}>
        <div style={s.searchInput}>
          <input
            placeholder="Buscar por cliente, numero o vendedor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ whiteSpace: 'nowrap', marginBottom: 0 }}>Fecha:</label>
          <input
            type="text"
            style={{ width: '130px' }}
            placeholder="dd/mm/aaaa"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </div>
      </div>

      <div style={s.section}>
        <table>
          <thead>
            <tr>
              <th>N. Venta</th>
              <th>Cliente</th>
              <th>Fecha / Hora</th>
              <th>Vendedor</th>
              <th>Items</th>
              <th>Metodo</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#a0b0c0', padding: '24px' }}>Sin resultados</td></tr>
            ) : filtradas.map((v) => (
              <tr key={v.id}>
                <td style={{ fontWeight: '700', color: '#2a5298', fontFamily: 'monospace' }}>{v.numero}</td>
                <td style={{ fontWeight: '600' }}>{v.cliente}</td>
                <td>
                  <div style={{ fontSize: '0.88rem' }}>{v.fecha}</div>
                  <div style={{ fontSize: '0.75rem', color: '#a0b0c0' }}>{v.hora}</div>
                </td>
                <td style={{ color: '#7a8fa6', fontSize: '0.88rem' }}>{v.vendedor}</td>
                <td style={{ color: '#7a8fa6' }}>{v.items}</td>
                <td>
                  <span style={{ ...metodoColor(v.metodo), padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                    {v.metodo}
                  </span>
                </td>
                <td style={{ fontWeight: '700', color: '#1a7f4e' }}>${v.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
