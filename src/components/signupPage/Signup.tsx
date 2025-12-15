'use client'
import { createCookie, storeData } from '@/lib/createCookie';
import { LoginAuth, SignUpAuth } from '@/services/auth/Auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Shield, Zap, Users, BarChart3 } from 'lucide-react';
import LightDarkLogo from '../Logo';
import { setUserDetails } from '@/store/features/userDetailsSlice';
import Link from 'next/link';
import { GoogleAuthButton } from './component/GoogleAuthButton';

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

const Signup = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<AuthFormData>({ email: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch()

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const authFunction = isLogin ? LoginAuth : SignUpAuth;
      const data = isLogin ? formData : { ...formData, name: formData.name! };

      const result = await authFunction(data);
      console.log(result)


      if (isLogin) {
        if (result.userdata != null) {
          createCookie(result.Token);
          storeData(result.userdata);
          dispatch(setUserDetails(result.userdata))
          setSuccess(true);

          // Success animation delay before navigation
          setTimeout(() => {
            router.push('/');
          }, 1500);
        } else {
          setError(result.message);
        }
      } else {
        if (result.data != null) {
          createCookie(result.Token);
          storeData(result.data);
          dispatch(setUserDetails(result.data))
          setSuccess(true);

          // Success animation delay before navigation
          setTimeout(() => {
            router.push('/');
          }, 1500);
        }
        else {
          setError(result.message);
        }
      }
    } catch (err: any) {
      console.log(err)
      // setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ email: '', password: '', name: '' });
  };

  const features = [
    { icon: <Zap className="w-5 h-5" />, text: "AI-Powered Automation" },
    { icon: <Users className="w-5 h-5" />, text: "Smart Customer Management" },
    { icon: <BarChart3 className="w-5 h-5" />, text: "Advanced Analytics" },
    { icon: <Shield className="w-5 h-5" />, text: "Enterprise Security" }
  ];

  const isFormValid = isLogin
    ? formData.email && formData.password
    : formData.name && formData.email && formData.password && agreed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 flex">
      {/* Left Panel - Brand & Features */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="flex items-center gap-3 mb-12">

          <div>
            <LightDarkLogo className='h-8' />
            <p className="text-blue-200 text-sm">Business Intelligence Platform</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Transform Your Business with AI
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              inXource provides AI-powered agents that manage sales, marketing, inventory,
              accounting, and more—all in one integrated platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-blue-300">{feature.icon}</div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-blue-200 text-sm">
          © 2024 Inxource. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 dark:bg-gray-800 flex items-center justify-center p-8">
        <div className="w-full max-w-md ">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex flex-col items-center gap-3">
              <LightDarkLogo className='h-8' />
              <p className="text-blue-200 text-sm">Business Intelligence Platform</p>
            </div>
          </div>

          {/* Auth Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isLogin ? 'Sign in to your account' : 'Join thousands of businesses'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-3 p-4 mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">
                  {isLogin ? 'Login successful! Redirecting...' : 'Account created successfully!'}
                </span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleAuth} className="space-y-6 text-gray-700 dark:text-gray-300">
              {/* Name Field (Signup only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      disabled={loading || success}
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={loading || success}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={loading || success}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms Agreement (Signup only) */}
              {!isLogin && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <input
                    type="checkbox"
                    required={!isLogin}
                    id="terms"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-1 flex-shrink-0"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || loading || success}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : success ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {isLogin ? 'Signed In!' : 'Account Created!'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>
            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">
                or {isLogin ? 'sign in' : 'sign up'} with
              </span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            {/* Google Auth Button */}
            <GoogleAuthButton isLogin={isLogin} />

            {/* Switch Mode */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={switchMode}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Forgot Password */}
            {isLogin && (
              <div className="text-center mt-4">
                <Link href="/forgot-Password" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Forgot your password?
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;