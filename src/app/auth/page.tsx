'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
<<<<<<< HEAD

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      window.location.href = '/dashboard';
    } else {
      const data = await res.json();
      setMessage(data.message);
=======
import { useRouter } from 'next/navigation';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  phone: string;
}

export default function AuthPage() {
  const router = useRouter();

  // Login form state
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
  });

  // UI state
  const [loginMessage, setLoginMessage] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Login form handlers
  const handleLoginChange = (field: keyof LoginForm, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
    setLoginMessage(''); // Clear message when user types
  };

  // Register form handlers
  const handleRegisterChange = (field: keyof RegisterForm, value: string) => {
    setRegisterForm(prev => ({ ...prev, [field]: value }));
    setRegisterMessage(''); // Clear message when user types
  };

  // Form validation
  const validateLoginForm = (): string | null => {
    if (!loginForm.email.trim()) return 'Email is required';
    if (!loginForm.password.trim()) return 'Password is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginForm.email)) return 'Invalid email format';

    return null;
  };

  const validateRegisterForm = (): string | null => {
    if (!registerForm.email.trim()) return 'Email is required';
    if (!registerForm.password.trim()) return 'Password is required';
    if (!registerForm.confirmPassword.trim())
      return 'Confirm password is required';
    if (!registerForm.address.trim()) return 'Address is required';
    if (!registerForm.phone.trim()) return 'Phone is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerForm.email)) return 'Invalid email format';

    if (registerForm.password.length < 6)
      return 'Password must be at least 6 characters long';
    if (registerForm.password !== registerForm.confirmPassword)
      return 'Passwords do not match';

    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(registerForm.phone)) return 'Invalid phone format';

    return null;
  };

  // API handlers
  const handleLogin = async () => {
    const validationError = validateLoginForm();
    if (validationError) {
      setLoginMessage(validationError);
      return;
    }

    setLoginLoading(true);
    setLoginMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Successful login - redirect to dashboard
        router.push('/dashboard');
      } else {
        setLoginMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setLoginMessage('Network error. Please try again.');
    } finally {
      setLoginLoading(false);
>>>>>>> 9536c36 (merge)
    }
  };

  const handleRegister = async () => {
<<<<<<< HEAD
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      // switch to login tab
=======
    const validationError = validateRegisterForm();
    if (validationError) {
      setRegisterMessage(validationError);
      return;
    }

    setRegisterLoading(true);
    setRegisterMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerForm.email,
          password: registerForm.password,
          address: registerForm.address,
          phone: registerForm.phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setRegisterMessage('Account created successfully! You can now login.');
        // Reset form
        setRegisterForm({
          email: '',
          password: '',
          confirmPassword: '',
          address: '',
          phone: '',
        });
      } else {
        setRegisterMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      setRegisterMessage('Network error. Please try again.');
    } finally {
      setRegisterLoading(false);
>>>>>>> 9536c36 (merge)
    }
  };

  return (
<<<<<<< HEAD
    <div className="flex justify-center items-center h-screen">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleLogin}>Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Create a new account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email-reg">Email</Label>
                <Input
                  id="email-reg"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password-reg">Password</Label>
                <Input
                  id="password-reg"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRegister}>Register</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      {message && <p className="text-red-500 mt-4">{message}</p>}
=======
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Access your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Your email"
                    value={loginForm.email}
                    onChange={e => handleLoginChange('email', e.target.value)}
                    disabled={loginLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={e =>
                      handleLoginChange('password', e.target.value)
                    }
                    disabled={loginLoading}
                  />
                </div>
                {loginMessage && (
                  <div
                    className={`text-sm ${
                      loginMessage.includes('success')
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {loginMessage}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleLogin}
                  disabled={loginLoading}
                  className="w-full"
                >
                  {loginLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Register a new account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="example@email.com"
                    value={registerForm.email}
                    onChange={e =>
                      handleRegisterChange('email', e.target.value)
                    }
                    disabled={registerLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Password"
                    value={registerForm.password}
                    onChange={e =>
                      handleRegisterChange('password', e.target.value)
                    }
                    disabled={registerLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">
                    Confirm Password
                  </Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="Confirm Password"
                    value={registerForm.confirmPassword}
                    onChange={e =>
                      handleRegisterChange('confirmPassword', e.target.value)
                    }
                    disabled={registerLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-address">Address</Label>
                  <Input
                    id="register-address"
                    type="text"
                    placeholder="123 Main St"
                    value={registerForm.address}
                    onChange={e =>
                      handleRegisterChange('address', e.target.value)
                    }
                    disabled={registerLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Phone</Label>
                  <Input
                    id="register-phone"
                    type="tel"
                    placeholder="+123 123 1234"
                    value={registerForm.phone}
                    onChange={e =>
                      handleRegisterChange('phone', e.target.value)
                    }
                    disabled={registerLoading}
                  />
                </div>
                {registerMessage && (
                  <div
                    className={`text-sm ${
                      registerMessage.includes('success')
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {registerMessage}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleRegister}
                  disabled={registerLoading}
                  className="w-full"
                >
                  {registerLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
>>>>>>> 9536c36 (merge)
    </div>
  );
}
