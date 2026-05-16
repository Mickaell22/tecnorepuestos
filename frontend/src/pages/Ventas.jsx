import { useState } from 'react';
import Layout from '../components/Layout.jsx';
import Modal from '../components/Modal.jsx';

const CLIENTES = ['Marco Salazar', 'Ana Torres', 'Luis Paredes', 'Carmen Vega', 'Roberto Diaz'];

const PRODUCTOS_DISPONIBLES = [
  { id: 1, nombre: 'Cable USB-C 2m', precio: 12.50 },
  { id: 2, nombre: 'Cargador 65W USB-C', precio: 35.00 },
  { id: 3, nombre: 'Hub USB 3.0 7 puertos', precio: 42.00 },
  { id: 5, nombre: 'Cable Lightning 1m', precio: 9.50 },
  { id: 7, nombre: 'Adaptador USB-C a MicroUSB', precio: 5.00 },
  { id: 8, nombre: 'Bateria portatil 20000mAh', precio: 65.00 },
];

const VENTAS_INIT = [
  { id: 1, numero: 'VT-2026-001', cliente: 'Marco Salazar', fecha: '16/05/2026', total: 245.00, estado: 'Pagada', items: 4, metodo: 'Tarjeta' },
  { id: 2, numero: 'VT-2026-002', cliente: 'Ana Torres', fecha: '16/05/2026', total: 89.50, estado: 'Pagada', items: 2, metodo: 'Efectivo' },
  { id: 3, numero: 'VT-2026-003', cliente: 'Luis Paredes', fecha: '15/05/2026', total: 412.00, estado: 'Pagada', items: 6, metodo: 'Transferencia' },
];

const s = {
  toolbar: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  btnPrimary: { padding: '9px 20px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' },
  btnSecondary: { padding: '9px 20px', background: '#f0f4f8', color: '#1e3a5f', border: '1px solid #c5d0dc', borderRadius: '7px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' },
  section: { background: '#fff', borderRadius: '10px', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  badge: { background: '#f0fdf4', color: '#1a7f4e', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  formField: { marginBottom: '14px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  btnGroup: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' },
  searchInput: { flex: 1, maxWidth: '300px' },
  itemRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' },
  removeBtn: { background: '#fdf0f0', border: '1px solid #f5c2c2', color: '#c0392b', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0, width: 'auto' },
  addItemBtn: { background: '#f0f4f8', border: '1px solid #c5d0dc', color: '#1e3a5f', borderRadius: '5px', padding: '7px 14px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', width: 'auto' },
  totalBox: { background: '#f0f4f8', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
};

const EMPTY_FORM = { cliente: CLIENTES[0], metodo: 'Efectivo', items: [{ productoId: 1, cantidad: 1 }] };

export default function Ventas() {
  const [ventas, setVentas] = useState(VENTAS_INIT);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [busqueda, setBusqueda] = useState('');

  const filtradas = ventas.filter((v) =>
    v.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.numero.toLowerCase().includes(busqueda.toLowerCase())
  );

  const calcTotal = () => {
    return form.items.reduce((acc, item) => {
      const prod = PRODUCTOS_DISPONIBLES.find((p) => p.id === parseInt(item.productoId));
      return acc + (prod ? prod.precio * item.cantidad : 0);
    }, 0);
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    const nueva = {
      id: Date.now(),
      numero: `VT-2026-${String(ventas.length + 1).padStart(3, '0')}`,
      cliente: form.cliente,
      fecha: new Date().toLocaleDateString('es-EC'),
      total: calcTotal(),
      estado: 'Pagada',
      items: form.items.reduce((a, i) => a + parseInt(i.cantidad || 1), 0),
      metodo: form.metodo,
    };
    setVentas([nueva, ...ventas]);
    setModal(false);
    setForm(EMPTY_FORM);
  };

  const updateItem = (idx, field, val) => {
    const updated = form.items.map((it, i) => i === idx ? { ...it, [field]: val } : it);
    setForm({ ...form, items: updated });
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { productoId: 1, cantidad: 1 }] });
  const removeItem = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });

  return (
    <Layout title="Registro de Ventas">
      <div style={s.toolbar}>
        <div style={s.searchInput}>
          <input
            placeholder="Buscar por cliente o numero..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button style={s.btnPrimary} onClick={() => setModal(true)}>+ Nueva Venta</button>
      </div>

      <div style={s.section}>
        <table>
          <thead>
            <tr>
              <th>N. Venta</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Items</th>
              <th>Metodo</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#a0b0c0', padding: '24px' }}>Sin resultados</td></tr>
            ) : filtradas.map((v) => (
              <tr key={v.id}>
                <td style={{ fontWeight: '700', color: '#2a5298', fontFamily: 'monospace' }}>{v.numero}</td>
                <td style={{ fontWeight: '600' }}>{v.cliente}</td>
                <td style={{ color: '#7a8fa6', fontSize: '0.88rem' }}>{v.fecha}</td>
                <td style={{ color: '#7a8fa6' }}>{v.items}</td>
                <td style={{ color: '#7a8fa6', fontSize: '0.88rem' }}>{v.metodo}</td>
                <td style={{ fontWeight: '700', color: '#1a7f4e' }}>${v.total.toFixed(2)}</td>
                <td><span style={s.badge}>{v.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Nueva Venta">
        <form onSubmit={handleGuardar}>
          <div style={s.formGrid}>
            <div style={s.formField}>
              <label>Cliente</label>
              <select value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })}>
                {CLIENTES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={s.formField}>
              <label>Metodo de pago</label>
              <select value={form.metodo} onChange={(e) => setForm({ ...form, metodo: e.target.value })}>
                <option>Efectivo</option>
                <option>Tarjeta</option>
                <option>Transferencia</option>
              </select>
            </div>
          </div>

          <label style={{ marginBottom: '8px' }}>Productos</label>
          {form.items.map((item, idx) => (
            <div key={idx} style={s.itemRow}>
              <select
                style={{ flex: 2 }}
                value={item.productoId}
                onChange={(e) => updateItem(idx, 'productoId', e.target.value)}
              >
                {PRODUCTOS_DISPONIBLES.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre} — ${p.precio.toFixed(2)}</option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                style={{ flex: 0.6, width: 'auto' }}
                value={item.cantidad}
                onChange={(e) => updateItem(idx, 'cantidad', parseInt(e.target.value) || 1)}
              />
              {form.items.length > 1 && (
                <button type="button" style={s.removeBtn} onClick={() => removeItem(idx)}>Quitar</button>
              )}
            </div>
          ))}
          <button type="button" style={{ ...s.addItemBtn, marginBottom: '14px' }} onClick={addItem}>
            + Agregar producto
          </button>

          <div style={s.totalBox}>
            <span style={{ fontWeight: '600', color: '#1e3a5f' }}>Total</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a7f4e' }}>
              ${calcTotal().toFixed(2)}
            </span>
          </div>

          <div style={s.btnGroup}>
            <button type="button" style={s.btnSecondary} onClick={() => setModal(false)}>Cancelar</button>
            <button type="submit" style={s.btnPrimary}>Registrar Venta</button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
