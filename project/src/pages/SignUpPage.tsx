import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { motion } from 'framer-motion';

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: 'PATIENT', label: 'Patient', desc: 'Book appointments & consult doctors' },
  { value: 'DOCTOR', label: 'Doctor', desc: 'Manage patients & consultations' },
  { value: 'PHARMACY', label: 'Pharmacy', desc: 'Manage inventory & prescriptions' },
];

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Submitting registration:', { name, email, role });
      const success = await register(name, email, password, role);
      if (success) {
        console.log('Registration successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        setError('Registration failed. Email may already be registered.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('Unable to connect to server. Please ensure backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-body">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative z-10 text-primary-foreground max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Heart className="w-7 h-7" />
            </div>
            <span className="font-display text-3xl font-bold">MeDora</span>
          </div>
          <h2 className="font-display text-4xl font-bold mb-4 leading-tight">
            Join the Future of Healthcare
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Whether you're a patient seeking care or a doctor ready to help, MeDora connects you seamlessly.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">MeDora</span>
          </div>

          <h1 className="font-display text-3xl font-bold mb-2">Create account</h1>
          <p className="text-muted-foreground mb-8">Choose your role and get started</p>

          {/* Role selection */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  role === r.value
                    ? 'border-primary bg-secondary text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                }`}
              >
                <span className="block text-sm font-semibold">{r.label}</span>
                <span className="block text-xs mt-1 text-muted-foreground">{r.desc}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-11" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>
            )}

            <Button type="submit" className="w-full h-11 bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
