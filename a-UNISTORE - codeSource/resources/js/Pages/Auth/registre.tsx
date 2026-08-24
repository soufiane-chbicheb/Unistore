import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Flower, ArrowRight } from 'lucide-react';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { Input } from '@/components/ui/Input';

export default function Register() {
    const { state: { currentTheme: theme } } = useStoreConfigCtx();
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    console.log('Validation Errors:', errors);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('register.store'), {
            onFinish: () => console.log('Submission finished'),
            onError: (err) => console.log('Submission Error:', err),
        });
    };

    return (
        <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
            <Head title="Create Account - UniStore" />
            
            {/* Left Section: Image/Branding (Reversed for Register) */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden"
            >
                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-blue-400 opacity-10 blur-3xl"></div>
                </div>

                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-16 text-white text-center">
                    <div className="max-w-xl mb-12">
                        <h2 className="text-5xl font-extrabold mb-6 leading-tight">Start your journey with UniStore today.</h2>
                        <p className="text-blue-100 text-lg font-medium opacity-90">Join thousands of businesses scaling their operations with our unified commerce platform.</p>
                    </div>
                    
                    {/* Mockup Image */}
                    <div className="w-full relative group">
                        <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <img 
                            src="/storage/auth/img.png" 
                            alt="Dashboard Mockup" 
                            className="w-full h-auto rounded-2xl shadow-2xl border border-white/10 relative transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Right Section: Form */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full lg:w-1/2 flex flex-col p-8 lg:px-16 lg:py-12 relative overflow-y-auto"
            >
                {/* Branding */}
                <Link href="/" className="flex items-center gap-2 mb-8 lg:mb-12 group">
                    <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                        <Flower size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">UniStore</span>
                </Link>

                <div className="max-w-md w-full mx-auto my-auto">
                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Create an Account</h1>
                        <p className="text-gray-500 font-medium">Join now to streamline your experience from day one.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <Input
                                label="Full Name"
                                type="text"
                                placeholder="Roger Gerrard"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                required
                            />
                            {errors.name && (
                                <div className="text-red-500 text-sm font-bold animate-bounce">
                                    ⚠️ {errors.name}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Input
                                label="Email"
                                type="email"
                                placeholder="sellostore@company.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                                required
                            />
                            {errors.email && (
                                <div className="text-red-500 text-sm font-bold animate-bounce">
                                    ⚠️ {errors.email}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative space-y-1">
                                <Input
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    required
                                />
                                {errors.password && (
                                    <div className="text-red-500 text-sm font-bold animate-bounce">
                                        ⚠️ {errors.password}
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <Input
                                label="Confirm Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        >
                            {processing ? 'Creating account...' : (
                                <>
                                    Register
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Social Login */}
                    <div className="mt-8">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
                                <span className="px-4 bg-white text-gray-400">Or Register With</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => window.location.href = route('google.login')}
                                className="flex items-center justify-center gap-3 h-12 bg-white border-2 border-gray-50 rounded-xl hover:border-gray-200 hover:bg-gray-50 transition-all font-bold text-gray-700 active:scale-95"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-3 h-12 bg-white border-2 border-gray-50 rounded-xl hover:border-gray-200 hover:bg-gray-50 transition-all font-bold text-gray-700 active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.073 10.717c.012-2.152 1.76-3.185 1.838-3.233-1.002-1.464-2.557-1.663-3.108-1.684-1.315-.133-2.565.776-3.232.776-.665 0-1.705-.76-2.8-.737-1.439.021-2.766.837-3.508 2.115-1.498 2.597-.384 6.444 1.073 8.546.714 1.03 1.56 2.186 2.678 2.145 1.077-.044 1.486-.697 2.788-.697 1.303 0 1.674.697 2.81.675 1.157-.021 1.89-1.044 2.596-2.074.816-1.196 1.154-2.353 1.173-2.41-.025-.011-2.253-.864-2.277-3.422zM14.654 4.195c.588-.713.984-1.703.876-2.695-.852.034-1.884.568-2.495 1.281-.548.63-.837 1.62-.837 2.61.95.074 1.884-.498 2.456-1.196z"/>
                                </svg>
                                Apple
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm font-semibold text-gray-500">
                        Already have an account?{' '}
                        <Link href={route('login')} className="text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-2 decoration-blue-200 hover:decoration-blue-600 transition-all">
                            Sign In
                        </Link>
                    </p>
                </div>

                {/* Footer Info */}
                <div className="mt-auto pt-8 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-gray-300">
                    <span>Copyright © {new Date().getFullYear()} UniStore Enterprises LTD.</span>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-gray-500 transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
