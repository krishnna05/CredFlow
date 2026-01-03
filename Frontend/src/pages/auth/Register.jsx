import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

import useAuth from '../../hooks/useAuth';
import InputField from '../../components/form/InputField';
import Button from '../../components/common/Button';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'business' // Default role
      });

      toast.success('Account created successfully!');
      navigate('/onboarding'); // Redirect to profile setup
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Registration failed');
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
          <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
          <p className="text-sm text-gray-500 mt-2">
            Start optimizing your cash flow today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Full Name"
            placeholder="John Doe"
            icon={User}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <InputField
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <InputField
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={error}
            required
          />

          <Button
            type="submit"
            className="w-full mt-2"
            loading={loading}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Sign Up
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-accent transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;