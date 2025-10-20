'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, Wallet } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual authentication
    setTimeout(() => {
      setIsLoading(false);
      router.push('/en/marketplace');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-dark-bg">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/en" className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center shadow-glow">
                <Wallet size={28} className="text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl text-white">MicroPropiedad</h1>
                <p className="text-xs text-gray-500">Real Estate DeFi</p>
              </div>
            </Link>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-400">
              Sign in to access your portfolio and investments
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-dark w-full pl-12"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-dark w-full pl-12 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-dark-border bg-dark-card text-primary-500 focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <Link
                href="/en/auth/forgot-password"
                className="text-sm text-primary-400 hover:text-primary-300 transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-dark-bg text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Web3 Login */}
            <Link
              href="/en/login"
              className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-xl border-2 border-dark-border text-gray-300 hover:border-primary-500 hover:bg-dark-hover transition-all font-medium"
            >
              <Wallet size={20} className="text-primary-400" />
              <span>Connect Wallet</span>
            </Link>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-gray-400">Don't have an account? </span>
              <Link
                href="/en/auth/register"
                className="text-primary-400 hover:text-primary-300 font-medium transition"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-accent-purple to-accent-pink items-center justify-center p-12 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-cyan rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-xl mb-6">
              <Wallet size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-display font-bold mb-4">
              Invest in Real Estate with Bitcoin
            </h2>
            <p className="text-xl text-white/90">
              Fractional property ownership starting from $10
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4">
              <p className="text-3xl font-bold mb-1">$2.5M+</p>
              <p className="text-sm text-white/80">Total Volume</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4">
              <p className="text-3xl font-bold mb-1">1,200+</p>
              <p className="text-sm text-white/80">Investors</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4">
              <p className="text-3xl font-bold mb-1">8.5%</p>
              <p className="text-sm text-white/80">Avg ROI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
