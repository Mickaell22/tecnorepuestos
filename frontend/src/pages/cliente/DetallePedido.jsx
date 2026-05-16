import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { PEDIDOS_MOCK } from '../../data/pedidosMock.js';

const s = {
  page: { minHeight: '100vh', background: '#f0f4f8' },
  header: {
    background: '#1e3a5f',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBrand: { color: '#fff', fontWeight: '800', fontSize: '1.1rem' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  userName: { color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', fontWeight: '600' },
  logoutBtn: {
    padding: '7px 16px',
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: '6px',
    fontSize: '0.82rem',
    cursor: 'pointer',
  },
  content: { maxWidth: '700px', margin: '0 auto', padding: '32px 24px' },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#2a5298',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '0',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  card: {
    background: '#fff',
    borderRadius: '10px',
    padding: '28px 30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: '16px',
  },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  numero: { fontWeight: '800', fontSize: '1.2rem', color: '#2a5298', fontFamily: 'monospace' },
  badge: {
    background: '#f0fdf4',
    color: '#1a7f4e',
    padding: '4px 14px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px 20px',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #eef2f7',
  },
  metaLabel: { fontSize: '0.75rem', color: '#a0b0c0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' },
  metaVal: { fontSize: '0.92rem', fontWeight: '600', color: '#1e3a5f' },
  sectionTitle: { fontSize: '1rem', fontWeight: '700', color: '#1e3a5f', marginBottom: '14px' },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #eef2f7',
  },
  itemName: { fontWeight: '600', color: '#1e3a5f', fontSize: '0.92rem' },
  itemQty: { fontSize: '0.82rem', color: '#7a8fa6', marginTop: '2px' },
  itemPrice: { fontWeight: '700', color: '#1e3a5f' },
  totalesSection: { marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #1e3a5f' },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '0.9rem',
    color: '#7a8fa6',
  },
  totalFinalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
    paddingTop: '10px',
    borderTop: '1px solid #eef2f7',
  },
  totalFinalLabel: { fontWeight: '800', fontSize: '1.05rem', color: '#1e3a5f' },
  totalFinalVal: { fontWeight: '800', fontSize: '1.25rem', color: '#1a7f4e' },
  downloadBtn: {
    display: 'block',
    width: '100%',
    padding: '14px',
    background: '#1e3a5f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: '8px',
  },
  downloadNote: { fontSize: '0.75rem', color: '#a0b0c0', textAlign: 'center', marginTop: '8px' },
};

export default function DetallePedido() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const pedido = PEDIDOS_MOCK.find((p) => String(p.id) === id);

  const handleLogout = () => {
    logout();
    navigate('/cliente/login');
  };

  const handleDescargar = () => {
    const contenido = `
TECNOREPUESTOS S.A.
Comprobante de Venta
=====================
Numero: ${pedido.numero}
Fecha: ${pedido.fecha}
Cliente: ${usuario?.nombre}
Metodo de pago: ${pedido.metodo}

PRODUCTOS:
${pedido.items.map((i) => `  - ${i.nombre} x${i.cantidad}  $${(i.precio * i.cantidad).toFixed(2)}`).join('\n')}

Subtotal: $${pedido.subtotal.toFixed(2)}
IVA 15%:  $${pedido.iva.toFixed(2)}
TOTAL:    $${pedido.total.toFixed(2)}

Estado: ${pedido.estado}
=====================
Gracias por su compra.
    `.trim();

    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprobante_${pedido.numero}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!pedido) {
    return (
      <div style={s.page}>
        <div style={s.header}>
          <div>
            <div style={s.headerBrand}>TecnoRepuestos S.A.</div>
            <div style={s.headerSub}>Portal del Cliente</div>
          </div>
        </div>
        <div style={s.content}>
          <button style={s.backBtn} onClick={() => navigate('/cliente/pedidos')}>&larr; Volver</button>
          <div style={{ ...s.card, textAlign: 'center', color: '#c0392b' }}>Pedido no encontrado.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.headerBrand}>TecnoRepuestos S.A.</div>
          <div style={s.headerSub}>Portal del Cliente</div>
        </div>
        <div style={s.headerRight}>
          <span style={s.userName}>{usuario?.nombre}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Cerrar sesion</button>
        </div>
      </div>

      <div style={s.content}>
        <button style={s.backBtn} onClick={() => navigate('/cliente/pedidos')}>
          &larr; Mis pedidos
        </button>

        <div style={s.card}>
          <div style={s.row}>
            <div style={s.numero}>{pedido.numero}</div>
            <span style={s.badge}>{pedido.estado}</span>
          </div>
          <div style={s.metaGrid}>
            <div>
              <div style={s.metaLabel}>Fecha</div>
              <div style={s.metaVal}>{pedido.fecha}</div>
            </div>
            <div>
              <div style={s.metaLabel}>Metodo de pago</div>
              <div style={s.metaVal}>{pedido.metodo}</div>
            </div>
            <div>
              <div style={s.metaLabel}>Cliente</div>
              <div style={s.metaVal}>{usuario?.nombre}</div>
            </div>
            <div>
              <div style={s.metaLabel}>N. Productos</div>
              <div style={s.metaVal}>{pedido.items.length}</div>
            </div>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.sectionTitle}>Detalle de productos</div>
          {pedido.items.map((item, idx) => (
            <div key={idx} style={{ ...s.itemRow, borderBottom: idx < pedido.items.length - 1 ? '1px solid #eef2f7' : 'none' }}>
              <div>
                <div style={s.itemName}>{item.nombre}</div>
                <div style={s.itemQty}>Cantidad: {item.cantidad} x ${item.precio.toFixed(2)}</div>
              </div>
              <div style={s.itemPrice}>${(item.precio * item.cantidad).toFixed(2)}</div>
            </div>
          ))}

          <div style={s.totalesSection}>
            <div style={s.totalRow}>
              <span>Subtotal</span>
              <span>${pedido.subtotal.toFixed(2)}</span>
            </div>
            <div style={s.totalRow}>
              <span>IVA 15%</span>
              <span>${pedido.iva.toFixed(2)}</span>
            </div>
            <div style={s.totalFinalRow}>
              <span style={s.totalFinalLabel}>Total</span>
              <span style={s.totalFinalVal}>${pedido.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.sectionTitle}>Comprobante</div>
          <button style={s.downloadBtn} onClick={handleDescargar}>
            Descargar comprobante
          </button>
          <div style={s.downloadNote}>Se descargara un archivo de texto con los detalles de su compra.</div>
        </div>
      </div>
    </div>
  );
}
