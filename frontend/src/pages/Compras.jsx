import { useState } from 'react';
import Layout from '../components/Layout.jsx';
import Modal from '../components/Modal.jsx';

const COMPRAS_INIT = [
  { id: 1, numero: 'OC-2026-001', proveedor: 'ElectroDistribuciones S.A.', fecha: '10/05/2026', total: 1250.00, estado: 'Recibida', items: 3 },
  { id: 2, numero: 'OC-2026-002', proveedor: 'TechSupply CIA.', fecha: '12/05/2026', total: 840.00, estado: 'Recibida', items: 2 },
  { id: 3, numero: 'OC-2026-003', proveedor: 'SoundTech S.A.', fecha: '14/05/2026', total: 2100.00, estado: 'Pendiente', items: 5 },
  { id: 4, numero: 'OC-2026-004', proveedor: 'PowerMax S.A.', fecha: '15/05/2026', total: 650.00, estado: 'En transito', items: 1 },
];

const PROVEEDORES = [
  'ElectroDistribuciones S.A.',
  'TechSupply CIA.',
  'SoundTech S.A.',
  'ImportaTech CIA.',
  'PowerMax S.A.',
];

const s = {
  toolbar: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  btnPrimary: { padding: '9px 20px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' },
  btnSecondary: { padding: '9px 20px', background: '#f0f4f8', color: '#1e3a5f', border: '1px solid #c5d0dc', borderRadius: '7px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' },
  section: { background: '#fff', borderRadius: '10px', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  badge: (estado) => {
    const map = { Recibida: ['#f0fdf4', '#1a7f4e'], Pendiente: ['#fff8e1', '#d4920a'], 'En transito': ['#eff6ff', '#2a5298'] };
    const [bg, color] = map[estado] || ['#f0f4f8', '#7a8fa6'];
    return { background: bg, color, padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' };
  },
  formField: { marginBottom: '14px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  btnGroup: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' },
  searchInput: { flex: 1, maxWidth: '300px' },
};

const EMPTY_FORM = { proveedor: PROVEEDORES[0], fecha: '', total: '', items: '', observaciones: '' };

export default function Compras() {
  const [compras, setCompras] = useState(COMPRAS_INIT);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [busqueda, setBusqueda] = useState('');

  const filtradas = compras.filter((c) =>
    c.proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.numero.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleGuardar = (e) => {
    e.preventDefault();
    const nueva = {
      id: Date.now(),
      numero: `OC-2026-${String(compras.length + 1).padStart(3, '0')}`,
      proveedor: form.proveedor,
      fecha: form.fecha || new Date().toLocaleDateString('es-EC'),
      total: parseFloat(form.total),
      estado: 'Pendiente',
      items: parseInt(form.items),
    };
    setCompras([nueva, ...compras]);
    setModal(false);
    setForm(EMPTY_FORM);
  };

  return (
    <Layout title="Ordenes de Compra">
      <div style={s.toolbar}>
        <div style={s.searchInput}>
          <input
            placeholder="Buscar por proveedor o numero..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button style={s.btnPrimary} onClick={() => setModal(true)}>+ Nueva Compra</button>
      </div>

      <div style={s.section}>
        <table>
          <thead>
            <tr>
              <th>N. Orden</th>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Items</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#a0b0c0', padding: '24px' }}>Sin resultados</td></tr>
            ) : filtradas.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: '700', color: '#2a5298', fontFamily: 'monospace' }}>{c.numero}</td>
                <td style={{ fontWeight: '600' }}>{c.proveedor}</td>
                <td style={{ color: '#7a8fa6', fontSize: '0.88rem' }}>{c.fecha}</td>
                <td style={{ color: '#7a8fa6' }}>{c.items} producto{c.items !== 1 ? 's' : ''}</td>
                <td style={{ fontWeight: '700', color: '#1e3a5f' }}>${c.total.toFixed(2)}</td>
                <td><span style={s.badge(c.estado)}>{c.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Nueva Orden de Compra">
        <form onSubmit={handleGuardar}>
          <div style={s.formField}>
            <label>Proveedor</label>
            <select value={form.proveedor} onChange={(e) => setForm({ ...form, proveedor: e.target.value })}>
              {PROVEEDORES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={s.formGrid}>
            <div style={s.formField}>
              <label>Fecha estimada de entrega</label>
              <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required />
            </div>
            <div style={s.formField}>
              <label>Cantidad de items</label>
              <input type="number" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} placeholder="0" required />
            </div>
          </div>
          <div style={s.formField}>
            <label>Total estimado (USD)</label>
            <input type="number" step="0.01" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} placeholder="0.00" required />
          </div>
          <div style={s.formField}>
            <label>Observaciones</label>
            <textarea rows={3} value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} placeholder="Detalles adicionales..." />
          </div>
          <div style={s.btnGroup}>
            <button type="button" style={s.btnSecondary} onClick={() => setModal(false)}>Cancelar</button>
            <button type="submit" style={s.btnPrimary}>Registrar Orden</button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
