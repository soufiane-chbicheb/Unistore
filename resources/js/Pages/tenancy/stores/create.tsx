import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Store, 
    Globe, 
    Link as LinkIcon, 
    ArrowRight, 
    ArrowLeft, 
    CheckCircle2, 
    Flower,
    Sparkles,
    Layout,
    Rocket
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Props {
    defaultDomain: string;
    nextIndex: number;
    auth: {
        user: {
            name: string;
            email: string;
        }
    }
}

export default function CreateStore({ defaultDomain, nextIndex, auth }: Props) {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        slug: '',
        domain: '',
    });

    // Auto-generate slug and domain when name changes
    useEffect(() => {
        if (step === 1) {
            const generatedSlug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            
            setData(prev => ({
                ...prev,
                slug: generatedSlug,
                domain: generatedSlug ? `${generatedSlug}.lvh.me` : defaultDomain
            }));
        }
    }, [data.name]);

    const nextStep = () => {
        if (step === 1) {
            if (!data.name) return;
            // Clear errors for the next step
            errors.name = undefined;
        }
        if (step === 2) {
            if (!data.slug) return;
            // Clear errors for the next step
            errors.slug = undefined;
            errors.domain = undefined;
        }
        if (step < totalSteps) setStep(step + 1);
    };

    // Helper to check if current step has errors
    const hasStepErrors = () => {
        if (step === 1) return !!errors.name;
        if (step === 2) return !!errors.slug || !!errors.domain;
        return false;
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    // Automatically jump to step with errors after submit
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            if (errors.name) {
                setStep(1);
            } else if (errors.slug || errors.domain) {
                setStep(2);
            }
        }
    }, [errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tenancy.stores.store'));
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Head title="Create Your Store" />

            {/* Navigation Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                        <Flower size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">UniStore</span>
                </Link>
                
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-bold text-gray-900">{auth.user.name}</span>
                        <span className="text-xs text-gray-500">{auth.user.email}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                        {auth.user.name.charAt(0)}
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
                <div className="max-w-2xl w-full">
                    {/* Stepper Indicator */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex flex-col items-center flex-1 relative">
                                    <div 
                                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                                            step >= s 
                                                ? (s === 1 && errors.name) || (s === 2 && (errors.slug || errors.domain))
                                                    ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                                                    : 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'bg-white text-gray-400 border-2 border-gray-200'
                                        }`}
                                    >
                                        {step > s && !((s === 1 && errors.name) || (s === 2 && (errors.slug || errors.domain))) ? <CheckCircle2 size={20} /> : s}
                                    </div>
                                    <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                                        (s === 1 && errors.name) || (s === 2 && (errors.slug || errors.domain))
                                            ? 'text-red-500'
                                            : step >= s ? 'text-blue-600' : 'text-gray-400'
                                    }`}>
                                        {s === 1 ? 'Identity' : s === 2 ? 'Address' : 'Launch'}
                                    </span>
                                    {s < 3 && (
                                        <div className={`absolute top-5 left-[50%] w-full h-0.5 -z-0 transition-all duration-500 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <form onSubmit={handleSubmit}>
                            <div className="p-8 sm:p-12">
                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div 
                                            key="step1"
                                            variants={stepVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="space-y-6"
                                        >
                                            <div className="space-y-2">
                                                <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-2">
                                                    <Store size={32} />
                                                </div>
                                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Name your empire.</h2>
                                                <p className="text-gray-500 font-medium">This is the heart of your brand. Choose a name that resonates with your customers.</p>
                                            </div>

                                            <Input
                                                label="Store Name"
                                                placeholder="My Awesome Shop"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                error={errors.name}
                                                autoFocus
                                            />
                                        </motion.div>
                                    )}

                                    {step === 2 && (
                                        <motion.div 
                                            key="step2"
                                            variants={stepVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="space-y-6"
                                        >
                                            <div className="space-y-2">
                                                <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-2">
                                                    <Globe size={32} />
                                                </div>
                                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Claim your spot.</h2>
                                                <p className="text-gray-500 font-medium">Define your store's unique address on the web.</p>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6">
                                                <Input
                                                    label="Store Slug (URL ID)"
                                                    placeholder="my-awesome-shop"
                                                    value={data.slug}
                                                    onChange={e => setData('slug', e.target.value)}
                                                    error={errors.slug}
                                                >
                                                    <LinkIcon size={18} className="text-gray-400" />
                                                </Input>

                                                <Input
                                                    label="Custom Domain (Optional)"
                                                    placeholder={defaultDomain}
                                                    value={data.domain}
                                                    onChange={e => setData('domain', e.target.value)}
                                                    error={errors.domain}
                                                    hint={`Defaults to: ${defaultDomain}`}
                                                >
                                                    <Globe size={18} className="text-gray-400" />
                                                </Input>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 3 && (
                                        <motion.div 
                                            key="step3"
                                            variants={stepVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="space-y-8 text-center"
                                        >
                                            <div className="flex flex-col items-center space-y-4">
                                                <motion.div 
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                                                    className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-inner"
                                                >
                                                    <Rocket size={48} />
                                                </motion.div>
                                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Ready for launch?</h2>
                                                <p className="text-gray-500 font-medium max-w-sm">Review your details below. Once you click launch, your store will be live and ready for business!</p>
                                            </div>

                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left space-y-4">
                                                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Store Name</span>
                                                    <span className="font-bold text-gray-900">{data.name || 'Not set'}</span>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Slug</span>
                                                    <span className="font-bold text-gray-900">{data.slug || 'Not set'}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Domain</span>
                                                    <span className="font-bold text-blue-600">{data.domain || defaultDomain}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer Actions */}
                            <div className="bg-gray-50 p-8 border-t border-gray-100 flex items-center justify-between">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={prevStep}
                                    disabled={step === 1 || processing}
                                    className={step === 1 ? 'invisible' : ''}
                                >
                                    <ArrowLeft size={18} className="mr-2" /> Back
                                </Button>

                                {step < totalSteps ? (
                                    <Button 
                                        type="button" 
                                        onClick={nextStep}
                                        disabled={step === 1 && !data.name}
                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                                    >
                                        Next Step <ArrowRight size={18} className="ml-2" />
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 px-10"
                                    >
                                        {processing ? 'Launching...' : 'Launch Store'} <Sparkles size={18} className="ml-2" />
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>

                    <p className="mt-8 text-center text-gray-400 text-sm font-medium">
                        Need help? <Link href="/support" className="text-blue-500 hover:underline">Contact our support team</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
