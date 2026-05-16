import { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import Modal from '../components/Modal.jsx';
import api from '../services/api.js';

const s = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  searchInput: {
    flex: 1,
    maxWidth: '300px',
  },
  btnPrimary: {
    padding: '9px 20px',
    background: '#1e3a5f',
    color: '#fff',
    border: 'none',
    borderRadius: '7px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  section: {
    background: '#fff',
    borderRadius: '10px',
    padding: '22px 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  badge: (stock, min) => {
    if (stock === 0) return { background: '#fdf0f0', color: '#c0392b', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' };
    if (stock < min) return { background: '#fff8e1', color: '#d4920a', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' };
    return { background: '#f0fdf4', color: '#1a7f4e', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' };
  },
  formField: { marginBottom: '14px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  btnGroup: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' },
  btnSecondary: {
    padding: '9px 20px',
    background: '#f0f4f8',
    color: '#1e3a5f',
    border: '1px solid #c5d0dc',
    borderRadius: '7px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  filterBtn: (active) => ({
    padding: '5px 14px',
    borderRadius: '20px',
    border: `1px solid ${active ? '#1e3a5f' : '#c5d0dc'}`,
    background: active ? '#1e3a5f' : '#fff',
    color: active ? '#fff' : '#4a6f95',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
  }),
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

const EMPTY_FORM = { sku: '', nombre: '', categoria: 'Cables', descripcion: '', precio_unitario: '', stock_actual: '', stock_minimo: '' };
const CATEGORIAS_FIJAS = ['Cables', 'Cargadores', 'Audio', 'Conectividad', 'Adaptadores', 'Baterias'];

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cargarProductos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch (err) {
      setError('No se pudo cargar el inventario. Verifique la conexion con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Calcular categorias dinamicas desde los datos + fijas
  const categoriasDisponibles = ['Todos', ...new Set([...CATEGORIAS_FIJAS, ...productos.map((p) => p.categoria)])];

  const filtrados = productos.filter((p) => {
    const matchBusq =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.sku.toLowerCase().includes(busqueda.toLowerCase());
    const matchCat = categoriaFiltro === 'Todos' || p.categoria === categoriaFiltro;
    return matchBusq && matchCat;
  });

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    try {
      await api.post('/productos', {
        ...form,
        precio_unitario: parseFloat(form.precio_unitario),
        stock_actual: parseInt(form.stock_actual) || 0,
        stock_minimo: parseInt(form.stock_minimo) || 5,
      });
      setModal(false);
      setForm(EMPTY_FORM);
      cargarProductos();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar el producto');
    } finally {
      setGuardando(false);
    }
  };

  const stockLabel = (stock, min) => {
    if (stock === 0) return 'Sin stock';
    if (stock < min) return 'Stock bajo';
    return 'Normal';
  };

  return (
    <Layout title="Inventario de Productos">
      {error && <div style={s.errorBox}>{error}</div>}

      <div style={s.toolbar}>
        <div style={s.searchInput}>
          <input
            aria-label="Buscar producto por nombre o SKU"
            placeholder="Buscar por nombre o SKU..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button style={s.btnPrimary} onClick={() => setModal(true)}>
          + Nuevo Producto
        </button>
      </div>

      <div style={s.section}>
        <div style={s.filterRow}>
          {categoriasDisponibles.map((cat) => (
            <button key={cat} style={s.filterBtn(categoriaFiltro === cat)} onClick={() => setCategoriaFiltro(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#a0b0c0', padding: '40px' }}>Cargando inventario...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto</th>
                <th>Categoria</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#a0b0c0', padding: '24px' }}>Sin resultados</td></tr>
              ) : filtrados.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#4a6f95' }}>{p.sku}</td>
                  <td style={{ fontWeight: '600' }}>{p.nombre}</td>
                  <td style={{ color: '#7a8fa6', fontSize: '0.87rem' }}>{p.categoria}</td>
                  <td style={{ fontWeight: '700', color: '#1e3a5f' }}>${parseFloat(p.precio_unitario).toFixed(2)}</td>
                  <td style={{ fontWeight: '700' }}>{p.stock_actual}</td>
                  <td><span style={s.badge(p.stock_actual, p.stock_minimo)}>{stockLabel(p.stock_actual, p.stock_minimo)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => { setModal(false); setError(''); }} title="Nuevo Producto">
        <form onSubmit={handleGuardar}>
          {error && <div style={s.errorBox}>{error}</div>}
          <div style={s.formGrid}>
            <div style={s.formField}>
              <label>SKU</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="CAB-USC-2M" required />
            </div>
            <div style={s.formField}>
              <label>Categoria</label>
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                {CATEGORIAS_FIJAS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={s.formField}>
            <label>Nombre del producto</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Cable USB-C 2m" required />
          </div>
          <div style={s.formField}>
            <label>Descripcion</label>
            <input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripcion opcional" />
          </div>
          <div style={s.formGrid}>
            <div style={s.formField}>
              <label>Precio (USD)</label>
              <input type="number" step="0.01" value={form.precio_unitario} onChange={(e) => setForm({ ...form, precio_unitario: e.target.value })} placeholder="0.00" required />
            </div>
            <div style={s.formField}>
              <label>Stock inicial</label>
              <input type="number" value={form.stock_actual} onChange={(e) => setForm({ ...form, stock_actual: e.target.value })} placeholder="0" required />
            </div>
          </div>
          <div style={s.formField}>
            <label>Stock minimo</label>
            <input type="number" value={form.stock_minimo} onChange={(e) => setForm({ ...form, stock_minimo: e.target.value })} placeholder="5" required />
          </div>
          <div style={s.btnGroup}>
            <button type="button" style={s.btnSecondary} onClick={() => { setModal(false); setError(''); }}>Cancelar</button>
            <button type="submit" style={s.btnPrimary} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
