import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';


const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary font-mono">Loading...</div>;
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Main Dashboard - Protected */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
                <h1 className="text-3xl font-mono">Main Dashboard (Coming Soon)</h1>
              </div>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;