import { useState } from 'react';
import Layout from '../components/Layout.jsx';
import Modal from '../components/Modal.jsx';

const PRODUCTOS_INIT = [
  { id: 1, sku: 'CAB-USC-2M', nombre: 'Cable USB-C 2m', categoria: 'Cables', precio: 12.50, stock: 147, stockMinimo: 30, proveedor: 'ElectroDistribuciones S.A.' },
  { id: 2, sku: 'CAR-65W-GN', nombre: 'Cargador 65W USB-C GaN', categoria: 'Cargadores', precio: 35.00, stock: 8, stockMinimo: 20, proveedor: 'TechSupply CIA.' },
  { id: 3, sku: 'AUD-BT-PRO', nombre: 'Audifonos Bluetooth Pro', categoria: 'Audio', precio: 89.00, stock: 0, stockMinimo: 10, proveedor: 'SoundTech S.A.' },
  { id: 4, sku: 'CAB-HDM-4K', nombre: 'Cable HDMI 2m 4K', categoria: 'Cables', precio: 18.00, stock: 5, stockMinimo: 15, proveedor: 'ElectroDistribuciones S.A.' },
  { id: 5, sku: 'HUB-USB-7P', nombre: 'Hub USB 3.0 7 puertos', categoria: 'Conectividad', precio: 42.00, stock: 34, stockMinimo: 10, proveedor: 'ImportaTech CIA.' },
  { id: 6, sku: 'CAB-LIG-1M', nombre: 'Cable Lightning 1m', categoria: 'Cables', precio: 9.50, stock: 210, stockMinimo: 50, proveedor: 'ElectroDistribuciones S.A.' },
  { id: 7, sku: 'ADA-USC-MIC', nombre: 'Adaptador USB-C a MicroUSB', categoria: 'Adaptadores', precio: 5.00, stock: 88, stockMinimo: 25, proveedor: 'TechSupply CIA.' },
  { id: 8, sku: 'BAT-PORT-20K', nombre: 'Bateria portatil 20000mAh', categoria: 'Baterias', precio: 65.00, stock: 22, stockMinimo: 8, proveedor: 'PowerMax S.A.' },
];

const CATEGORIAS = ['Todos', 'Cables', 'Cargadores', 'Audio', 'Conectividad', 'Adaptadores', 'Baterias'];

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
};

const EMPTY_FORM = { sku: '', nombre: '', categoria: 'Cables', precio: '', stock: '', stockMinimo: '', proveedor: '' };

export default function Inventario() {
  const [productos, setProductos] = useState(PRODUCTOS_INIT);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtrados = productos.filter((p) => {
    const matchBusq = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.sku.toLowerCase().includes(busqueda.toLowerCase());
    const matchCat = categoriaFiltro === 'Todos' || p.categoria === categoriaFiltro;
    return matchBusq && matchCat;
  });

  const handleGuardar = (e) => {
    e.preventDefault();
    const nuevo = {
      id: Date.now(),
      ...form,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
      stockMinimo: parseInt(form.stockMinimo),
    };
    setProductos([...productos, nuevo]);
    setModal(false);
    setForm(EMPTY_FORM);
  };

  const stockLabel = (stock, min) => {
    if (stock === 0) return 'Sin stock';
    if (stock < min) return 'Stock bajo';
    return 'Normal';
  };

  return (
    <Layout title="Inventario de Productos">
      <div style={s.toolbar}>
        <div style={s.searchInput}>
          <input
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
          {CATEGORIAS.map((cat) => (
            <button key={cat} style={s.filterBtn(categoriaFiltro === cat)} onClick={() => setCategoriaFiltro(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Producto</th>
              <th>Categoria</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Proveedor</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#a0b0c0', padding: '24px' }}>Sin resultados</td></tr>
            ) : filtrados.map((p) => (
              <tr key={p.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#4a6f95' }}>{p.sku}</td>
                <td style={{ fontWeight: '600' }}>{p.nombre}</td>
                <td style={{ color: '#7a8fa6', fontSize: '0.87rem' }}>{p.categoria}</td>
                <td style={{ fontWeight: '700', color: '#1e3a5f' }}>${p.precio.toFixed(2)}</td>
                <td style={{ fontWeight: '700' }}>{p.stock}</td>
                <td><span style={s.badge(p.stock, p.stockMinimo)}>{stockLabel(p.stock, p.stockMinimo)}</span></td>
                <td style={{ fontSize: '0.85rem', color: '#7a8fa6' }}>{p.proveedor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Nuevo Producto">
        <form onSubmit={handleGuardar}>
          <div style={s.formGrid}>
            <div style={s.formField}>
              <label>SKU</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="CAB-USC-2M" required />
            </div>
            <div style={s.formField}>
              <label>Categoria</label>
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                {CATEGORIAS.slice(1).map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={s.formField}>
            <label>Nombre del producto</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Cable USB-C 2m" required />
          </div>
          <div style={s.formGrid}>
            <div style={s.formField}>
              <label>Precio (USD)</label>
              <input type="number" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} placeholder="0.00" required />
            </div>
            <div style={s.formField}>
              <label>Stock inicial</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" required />
            </div>
          </div>
          <div style={s.formGrid}>
            <div style={s.formField}>
              <label>Stock minimo</label>
              <input type="number" value={form.stockMinimo} onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })} placeholder="10" required />
            </div>
            <div style={s.formField}>
              <label>Proveedor</label>
              <input value={form.proveedor} onChange={(e) => setForm({ ...form, proveedor: e.target.value })} placeholder="Nombre del proveedor" required />
            </div>
          </div>
          <div style={s.btnGroup}>
            <button type="button" style={s.btnSecondary} onClick={() => setModal(false)}>Cancelar</button>
            <button type="submit" style={s.btnPrimary}>Guardar Producto</button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
