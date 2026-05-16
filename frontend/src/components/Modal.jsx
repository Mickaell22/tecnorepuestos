const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const box = {
  background: '#fff',
  borderRadius: '10px',
  padding: '28px 32px',
  minWidth: '420px',
  maxWidth: '560px',
  width: '100%',
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const header = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '20px',
};

const title = {
  fontSize: '1.1rem',
  fontWeight: '700',
  color: '#1e3a5f',
};

const closeBtn = {
  background: 'none',
  border: 'none',
  fontSize: '1.3rem',
  color: '#7a8fa6',
  cursor: 'pointer',
  lineHeight: 1,
};

export default function Modal({ isOpen, onClose, title: ttl, children }) {
  if (!isOpen) return null;
  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={box}>
        <div style={header}>
          <span style={title}>{ttl}</span>
          <button style={closeBtn} onClick={onClose} aria-label="Cerrar">&#x2715;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
