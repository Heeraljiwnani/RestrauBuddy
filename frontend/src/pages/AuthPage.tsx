import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/Logo';
import { Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Success! Check your email for a confirmation link.');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        padding: '1rem 1rem 1rem 3.25rem',
        borderRadius: '14px',
        background: 'var(--input-bg)',
        border: '1px solid var(--glass-border-subtle)',
        color: 'hsl(var(--foreground))',
        outline: 'none',
        width: '100%',
        transition: 'all 0.3s ease',
        fontSize: '1rem',
        fontWeight: 600
    };

    const containerStyle: React.CSSProperties = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'hsl(var(--background))',
        position: 'relative',
        overflow: 'hidden',
        padding: '1.5rem',
        transition: 'background-color 0.4s ease'
    };

    return (
        <motion.div style={containerStyle}>
            {/* Ambient Background Glows */}
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, hsla(var(--primary), 0.06) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, hsla(var(--vibrant-rose), 0.04) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none' }}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="glass"
                style={{
                    width: '100%',
                    maxWidth: '460px',
                    padding: '3.5rem 2.5rem',
                    borderRadius: '32px',
                    boxShadow: 'var(--glass-shadow)',
                    position: 'relative',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--glass-bg)',
                    zIndex: 10
                }}
            >
                {/* Brand Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <Logo size={80} className="mx-auto" />
                    <h1 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.04em', background: 'linear-gradient(to right, hsl(var(--foreground)), hsl(var(--muted-foreground)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        RestrauBuddy
                    </h1>
                    <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.1rem', fontWeight: 500 }}>
                        {isLogin ? 'Welcome back to your kitchen' : 'Join the future of kitchen management'}
                    </p>
                </div>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground-subtle)' }} size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground-subtle)' }} size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '14px',
                                    background: 'rgba(239, 68, 68, 0.08)',
                                    border: '1px solid rgba(239, 68, 68, 0.15)',
                                    color: '#f87171',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    fontWeight: 600
                                }}
                            >
                                <AlertCircle size={18} strokeWidth={2.5} />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-center glow"
                        style={{
                            padding: '1.125rem',
                            borderRadius: '16px',
                            background: loading ? 'var(--input-bg)' : 'hsl(var(--primary))',
                            color: 'hsl(var(--primary-foreground))',
                            border: 'none',
                            fontWeight: 800,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            gap: '0.75rem',
                            fontSize: '1.1rem',
                            marginTop: '0.5rem',
                            transition: 'all 0.3s ease',
                            boxShadow: loading ? 'none' : '0 12px 24px -6px rgba(59, 130, 246, 0.4)'
                        }}
                    >
                        {loading ? (
                            <div className="animate-spin" style={{ width: 22, height: 22, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></div>
                        ) : (
                            <>
                                {isLogin ? <LogIn size={20} strokeWidth={2.5} /> : <UserPlus size={20} strokeWidth={2.5} />}
                                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1rem', fontWeight: 600 }}>
                        {isLogin ? "New to RestrauBuddy?" : "Have an account already?"}{' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'hsl(var(--primary))',
                                fontWeight: 800,
                                cursor: 'pointer',
                                padding: '0 0.25rem',
                                fontSize: '1rem',
                                textDecoration: 'underline',
                                textUnderlineOffset: '4px'
                            }}
                        >
                            {isLogin ? 'Create Account' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AuthPage;
