import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../services/authService';
import { FiTerminal } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface-container rounded-xl border border-outline/30 p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-surface-bright rounded-xl flex items-center justify-center mb-4 shadow-inner border border-outline/20">
            <FiTerminal className="text-primary text-3xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">DevSync</h1>
          <p className="text-outline text-sm mt-2 font-mono">Authenticate to Workspace</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error/10 text-error text-sm rounded border border-error/20 font-mono">
            {'>'} Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="developer@company.com"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-outline uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs text-primary hover:text-surface-tint font-mono">Forgot?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-mono tracking-widest"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-container text-on-primary-container font-semibold py-2.5 px-4 rounded-md hover:bg-primary transition-colors mt-6 flex justify-center items-center"
          >
            {isLoading ? 'Authenticating...' : 'Initialize Session ->'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-outline/20 pt-6">
          <p className="text-sm text-outline">
            No access token? <Link to="/register" className="text-primary hover:underline font-medium">Request Access</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;