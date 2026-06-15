import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import { WorkspaceProvider } from './context/WorkspaceContext.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <WorkspaceProvider>
        <App />
        </WorkspaceProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>,
);