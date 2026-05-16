import { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import Modal from '../components/Modal.jsx';
import api from '../services/api.js';

const s = {
  toolbar: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  btnPrimary: { padding: '9px 20px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' },
  btnSecondary: { padding: '9px 20px', background: '#f0f4f8', color: '#1e3a5f', border: '1px solid #c5d0dc', borderRadius: '7px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' },
  section: { background: '#fff', borderRadius: '10px', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  badge: (estado) => {
    const map = { confirmada: ['#f0fdf4', '#1a7f4e'], anulada: ['#fdf0f0', '#c0392b'] };
    const [bg, color] = map[estado] || ['#f0f4f8', '#7a8fa6'];
    return { background: bg, color, padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' };
  },
  formField: { marginBottom: '14px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  btnGroup: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' },
  searchInput: { flex: 1, maxWidth: '300px' },
  itemRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' },
  removeBtn: { background: '#fdf0f0', border: '1px solid #f5c2c2', color: '#c0392b', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0, width: 'auto' },
  addItemBtn: { background: '#f0f4f8', border: '1px solid #c5d0dc', color: '#1e3a5f', borderRadius: '5px', padding: '7px 14px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', width: 'auto', marginBottom: '14px' },
  totalBox: { background: '#f0f4f8', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  errorBox: { background: '#fff0f0', border: '1px solid #f5c2c2', color: '#c0392b', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.88rem' },
};

const EMPTY_ITEM = { producto_id: '', cantidad: 1, precio_compra: '' };

export default function Compras() {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [modal, setModal] = useState(false);
  const [proveedorId, setProveedorId] = useState('');
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    setLoading(true);
    setError('');
    try {
      const [resCompras, resProv, resProd] = await Promise.all([
        api.get('/compras'),
        api.get('/proveedores'),
        api.get('/productos'),
      ]);
      setCompras(resCompras.data);
      setProveedores(resProv.data);
      setProductos(resProd.data);
      if (resProv.data.length > 0) setProveedorId(String(resProv.data[0].id));
    } catch (err) {
      setError('No se pudieron cargar los datos. Verifique la conexion con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const calcTotal = () =>
    items.reduce((acc, it) => acc + (parseFloat(it.precio_compra) || 0) * (parseInt(it.cantidad) || 0), 0);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    try {
      const detalles = items.map((it) => ({
        producto_id: parseInt(it.producto_id),
        cantidad: parseInt(it.cantidad),
        precio_compra: parseFloat(it.precio_compra),
      }));
      await api.post('/compras', { proveedor_id: parseInt(proveedorId), detalles });
      setModal(false);
      setItems([{ ...EMPTY_ITEM }]);
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrar la compra');
    } finally {
      setGuardando(false);
    }
  };

  const updateItem = (idx, field, val) => {
    setItems(items.map((it, i) => i === idx ? { ...it, [field]: val } : it));
  };
  const addItem = () => setItems([...items, { ...EMPTY_ITEM }]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const filtradas = compras.filter((c) => {
    const nombre = c.Proveedor?.nombre || '';
    return nombre.toLowerCase().includes(busqueda.toLowerCase());
  });

  const formatFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-EC');
  };

  return (
    <Layout title="Ordenes de Compra">
      {error && !modal && <div style={s.errorBox}>{error}</div>}

      <div style={s.toolbar}>
        <div style={s.searchInput}>
          <input
            aria-label="Buscar compra por proveedor"
            placeholder="Buscar por proveedor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button style={s.btnPrimary} onClick={() => setModal(true)}>+ Nueva Compra</button>
      </div>

      <div style={s.section}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#a0b0c0', padding: '40px' }}>Cargando compras...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#a0b0c0', padding: '24px' }}>Sin resultados</td></tr>
              ) : filtradas.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: '700', color: '#2a5298', fontFamily: 'monospace' }}>#{c.id}</td>
                  <td style={{ fontWeight: '600' }}>{c.Proveedor?.nombre || '—'}</td>
                  <td style={{ color: '#7a8fa6', fontSize: '0.88rem' }}>{formatFecha(c.createdAt)}</td>
                  <td style={{ fontWeight: '700', color: '#1e3a5f' }}>${parseFloat(c.total).toFixed(2)}</td>
                  <td><span style={s.badge(c.estado)}>{c.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => { setModal(false); setError(''); setItems([{ ...EMPTY_ITEM }]); }} title="Nueva Orden de Compra">
        <form onSubmit={handleGuardar}>
          {error && <div style={s.errorBox}>{error}</div>}
          <div style={s.formField}>
            <label>Proveedor</label>
            <select value={proveedorId} onChange={(e) => setProveedorId(e.target.value)} required>
              {proveedores.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>

          <label style={{ marginBottom: '8px', display: 'block' }}>Productos</label>
          {items.map((item, idx) => (
            <div key={idx} style={s.itemRow}>
              <select
                style={{ flex: 2 }}
                value={item.producto_id}
                onChange={(e) => updateItem(idx, 'producto_id', e.target.value)}
                required
              >
                <option value="">-- Seleccionar producto --</option>
                {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre} (SKU: {p.sku})</option>)}
              </select>
              <input
                type="number"
                min={1}
                style={{ flex: 0.6, width: 'auto' }}
                placeholder="Cant."
                value={item.cantidad}
                onChange={(e) => updateItem(idx, 'cantidad', e.target.value)}
                required
              />
              <input
                type="number"
                step="0.01"
                min={0}
                style={{ flex: 1, width: 'auto' }}
                placeholder="Precio compra"
                value={item.precio_compra}
                onChange={(e) => updateItem(idx, 'precio_compra', e.target.value)}
                required
              />
              {items.length > 1 && (
                <button type="button" style={s.removeBtn} onClick={() => removeItem(idx)}>Quitar</button>
              )}
            </div>
          ))}
          <button type="button" style={s.addItemBtn} onClick={addItem}>+ Agregar producto</button>

          <div style={s.totalBox}>
            <span style={{ fontWeight: '600', color: '#1e3a5f' }}>Total estimado</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e3a5f' }}>${calcTotal().toFixed(2)}</span>
          </div>

          <div style={s.btnGroup}>
            <button type="button" style={s.btnSecondary} onClick={() => { setModal(false); setError(''); setItems([{ ...EMPTY_ITEM }]); }}>Cancelar</button>
            <button type="submit" style={s.btnPrimary} disabled={guardando}>
              {guardando ? 'Registrando...' : 'Registrar Orden'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
