'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, Phone, Wallet, MapPin, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: '',
    email: '',
    phone: '',
    country: '',

    // Step 2: Account
    password: '',
    confirmPassword: '',

    // Step 3: Preferences
    accountType: 'investor', // investor | owner
    acceptTerms: false,
    newsletter: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsLoading(true);

    // TODO: Implement actual registration
    setTimeout(() => {
      setIsLoading(false);
      router.push('/en/marketplace');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex bg-dark-bg">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
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

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s <= step
                      ? 'bg-gradient-to-br from-primary-500 to-accent-purple text-white shadow-glow'
                      : 'bg-dark-card text-gray-500'
                  }`}
                >
                  {s < step ? <Check size={20} /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      s < step ? 'bg-gradient-to-r from-primary-500 to-accent-purple' : 'bg-dark-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              {step === 1 && 'Create Account'}
              {step === 2 && 'Secure Your Account'}
              {step === 3 && 'Final Step'}
            </h2>
            <p className="text-gray-400">
              {step === 1 && 'Enter your personal information'}
              {step === 2 && 'Choose a strong password'}
              {step === 3 && 'Select your account type'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="input-dark w-full pl-12"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-dark w-full pl-12"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country of Residence *
                  </label>
                  <div className="relative">
                    <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="input-dark w-full pl-12 appearance-none"
                    >
                      <option value="">Select country</option>
                      <option value="MX">Mexico</option>
                      <option value="CO">Colombia</option>
                      <option value="BR">Brazil</option>
                      <option value="AR">Argentina</option>
                      <option value="CL">Chile</option>
                      <option value="US">United States</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password *
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
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use 8+ characters with letters, numbers & symbols
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-dark w-full pl-12 pr-12"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Account Type & Terms */}
            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Account Type *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, accountType: 'investor' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.accountType === 'investor'
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-dark-border hover:border-dark-hover'
                      }`}
                    >
                      <Wallet size={32} className={`mx-auto mb-2 ${formData.accountType === 'investor' ? 'text-primary-400' : 'text-gray-500'}`} />
                      <p className="font-medium text-white">Investor</p>
                      <p className="text-xs text-gray-500 mt-1">Buy property shares</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, accountType: 'owner' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.accountType === 'owner'
                          ? 'border-accent-green bg-accent-green/10'
                          : 'border-dark-border hover:border-dark-hover'
                      }`}
                    >
                      <MapPin size={32} className={`mx-auto mb-2 ${formData.accountType === 'owner' ? 'text-accent-green' : 'text-gray-500'}`} />
                      <p className="font-medium text-white">Owner</p>
                      <p className="text-xs text-gray-500 mt-1">Tokenize property</p>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      required
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 rounded border-dark-border bg-dark-card text-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-400">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary-400 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-primary-400 hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 rounded border-dark-border bg-dark-card text-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-400">
                      Send me updates about new properties and features
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn btn-outline flex-1"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex-1"
              >
                {isLoading ? 'Creating account...' : step === 3 ? 'Create Account' : 'Continue'}
              </button>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <span className="text-gray-400">Already have an account? </span>
              <Link
                href="/en/auth/login"
                className="text-primary-400 hover:text-primary-300 font-medium transition"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Visual (same as login) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent-green via-accent-cyan to-primary-500 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-purple rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 text-center text-white max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-xl mb-6">
              <User size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-display font-bold mb-4">
              Join MicroPropiedad
            </h2>
            <p className="text-xl text-white/90">
              Start your real estate investment journey today
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-start gap-3">
              <Check size={24} className="text-accent-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Fractional Ownership</p>
                <p className="text-sm text-white/80">Invest from $10 in premium properties</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check size={24} className="text-accent-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Passive Income</p>
                <p className="text-sm text-white/80">Earn monthly rental income</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check size={24} className="text-accent-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Blockchain Secured</p>
                <p className="text-sm text-white/80">Transparent & immutable ownership</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
