import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

// Páginas sistema interno
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Inventario from './pages/Inventario.jsx';
import Compras from './pages/Compras.jsx';
import Ventas from './pages/Ventas.jsx';
import HistorialVentas from './pages/HistorialVentas.jsx';

// Portal cliente
import ClienteLogin from './pages/cliente/ClienteLogin.jsx';
import MisPedidos from './pages/cliente/MisPedidos.jsx';
import DetallePedido from './pages/cliente/DetallePedido.jsx';

function PrivateRoute({ children, rolRequerido }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (rolRequerido && usuario.rol !== rolRequerido) return <Navigate to="/login" replace />;
  return children;
}

function ClientePrivateRoute({ children }) {
  const { usuario } = useAuth();
  if (!usuario || usuario.rol !== 'cliente') return <Navigate to="/cliente/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Sistema interno */}
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/inventario" element={<PrivateRoute><Inventario /></PrivateRoute>} />
      <Route path="/compras" element={<PrivateRoute><Compras /></PrivateRoute>} />
      <Route path="/ventas" element={<PrivateRoute><Ventas /></PrivateRoute>} />
      <Route path="/historial-ventas" element={<PrivateRoute><HistorialVentas /></PrivateRoute>} />

      {/* Portal cliente */}
      <Route path="/cliente/login" element={<ClienteLogin />} />
      <Route path="/cliente/pedidos" element={<ClientePrivateRoute><MisPedidos /></ClientePrivateRoute>} />
      <Route path="/cliente/pedidos/:id" element={<ClientePrivateRoute><DetallePedido /></ClientePrivateRoute>} />

      {/* Redirecciones */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
