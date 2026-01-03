import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

import useAuth from '../../hooks/useAuth';
import InputField from '../../components/form/InputField';
import Button from '../../components/common/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-accent font-bold text-2xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign in to CredFlow</h1>
          <p className="text-sm text-gray-500 mt-2">
            Access your business dashboard and financing offers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <div>
            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <div className="flex justify-end mt-1">
              <Link to="#" className="text-xs font-medium text-primary hover:text-accent transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={loading}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-accent transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;