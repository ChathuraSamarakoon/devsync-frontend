import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { FiUserPlus } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      
      await registerUser(formData);
      
      
      alert('Registration successful! Please log in.');
      
      
      navigate('/login');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface-container rounded-xl border border-outline/30 p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-surface-bright rounded-xl flex items-center justify-center mb-4 shadow-inner border border-outline/20">
            <FiUserPlus className="text-secondary text-3xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Create Identity</h1>
          <p className="text-outline text-sm mt-2 font-mono">Join the DevSync workspace</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error/10 text-error text-sm rounded border border-error/20 font-mono">
            {'>'} Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2">
              Display Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-4 py-2.5 text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-4 py-2.5 text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
              placeholder="developer@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-4 py-2.5 text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors font-mono tracking-widest"
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-secondary-container text-on-secondary-container font-semibold py-2.5 px-4 rounded-md hover:bg-secondary hover:text-on-secondary transition-colors mt-6 flex justify-center items-center"
          >
            {isLoading ? 'Processing...' : 'Compile User ->'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-outline/20 pt-6">
          <p className="text-sm text-outline">
            Already have access? <Link to="/login" className="text-secondary hover:underline font-medium">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;