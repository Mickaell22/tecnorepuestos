import { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import Modal from '../components/Modal.jsx';
import api from '../services/api.js';

const s = {
  toolbar: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  btnPrimary: { padding: '9px 20px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' },
  btnSecondary: { padding: '9px 20px', background: '#f0f4f8', color: '#1e3a5f', border: '1px solid #c5d0dc', borderRadius: '7px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' },
  section: { background: '#fff', borderRadius: '10px', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  badge: { background: '#f0fdf4', color: '#1a7f4e', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  badgeAnulada: { background: '#fdf0f0', color: '#c0392b', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  formField: { marginBottom: '14px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  btnGroup: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' },
  searchInput: { flex: 1, maxWidth: '300px' },
  itemRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' },
  removeBtn: { background: '#fdf0f0', border: '1px solid #f5c2c2', color: '#c0392b', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0, width: 'auto' },
  addItemBtn: { background: '#f0f4f8', border: '1px solid #c5d0dc', color: '#1e3a5f', borderRadius: '5px', padding: '7px 14px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', width: 'auto' },
  totalBox: { background: '#f0f4f8', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  errorBox: { background: '#fff0f0', border: '1px solid #f5c2c2', color: '#c0392b', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.88rem' },
};

const EMPTY_ITEM = { producto_id: '', cantidad: 1 };

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [modal, setModal] = useState(false);
  const [clienteId, setClienteId] = useState('');
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    setLoading(true);
    setError('');
    try {
      const [resVentas, resCli, resProd] = await Promise.all([
        api.get('/ventas'),
        api.get('/clientes'),
        api.get('/productos'),
      ]);
      setVentas(resVentas.data);
      setClientes(resCli.data);
      setProductos(resProd.data);
      if (resCli.data.length > 0) setClienteId(String(resCli.data[0].id));
    } catch (err) {
      setError('No se pudieron cargar los datos. Verifique la conexion con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const calcTotal = () => {
    return items.reduce((acc, item) => {
      const prod = productos.find((p) => String(p.id) === String(item.producto_id));
      return acc + (prod ? parseFloat(prod.precio_unitario) * (parseInt(item.cantidad) || 0) : 0);
    }, 0);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    try {
      const detalles = items.map((it) => ({
        producto_id: parseInt(it.producto_id),
        cantidad: parseInt(it.cantidad),
      }));
      await api.post('/ventas', { cliente_id: parseInt(clienteId), detalles });
      setModal(false);
      setItems([{ ...EMPTY_ITEM }]);
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrar la venta');
    } finally {
      setGuardando(false);
    }
  };

  const updateItem = (idx, field, val) => {
    setItems(items.map((it, i) => i === idx ? { ...it, [field]: val } : it));
  };
  const addItem = () => setItems([...items, { ...EMPTY_ITEM }]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const filtradas = ventas.filter((v) => {
    const nombre = v.Cliente?.nombre || '';
    return nombre.toLowerCase().includes(busqueda.toLowerCase());
  });

  const formatFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-EC');
  };

  return (
    <Layout title="Registro de Ventas">
      {error && !modal && <div style={s.errorBox}>{error}</div>}

      <div style={s.toolbar}>
        <div style={s.searchInput}>
          <input
            aria-label="Buscar venta por cliente"
            placeholder="Buscar por cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button style={s.btnPrimary} onClick={() => setModal(true)}>+ Nueva Venta</button>
      </div>

      <div style={s.section}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#a0b0c0', padding: '40px' }}>Cargando ventas...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
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
                  <td style={{ color: '#7a8fa6', fontSize: '0.88rem' }}>{formatFecha(v.createdAt)}</td>
                  <td style={{ fontWeight: '700', color: '#1a7f4e' }}>${parseFloat(v.total).toFixed(2)}</td>
                  <td><span style={v.estado === 'confirmada' ? s.badge : s.badgeAnulada}>{v.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => { setModal(false); setError(''); setItems([{ ...EMPTY_ITEM }]); }} title="Nueva Venta">
        <form onSubmit={handleGuardar}>
          {error && <div style={s.errorBox}>{error}</div>}
          <div style={s.formField}>
            <label>Cliente</label>
            <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
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
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — ${parseFloat(p.precio_unitario).toFixed(2)} (stock: {p.stock_actual})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                style={{ flex: 0.6, width: 'auto' }}
                value={item.cantidad}
                onChange={(e) => updateItem(idx, 'cantidad', parseInt(e.target.value) || 1)}
              />
              {items.length > 1 && (
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
            <button type="button" style={s.btnSecondary} onClick={() => { setModal(false); setError(''); setItems([{ ...EMPTY_ITEM }]); }}>Cancelar</button>
            <button type="submit" style={s.btnPrimary} disabled={guardando}>
              {guardando ? 'Registrando...' : 'Registrar Venta'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
