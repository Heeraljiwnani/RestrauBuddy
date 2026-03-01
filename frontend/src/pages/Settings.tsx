import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Globe, User, Shield, Bell, Save, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const SettingsPage = () => {
    const { language, setLanguage, t } = useLanguage();
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        restaurant_name: 'Spice Garden',
        location: 'Mumbai, India',
        email_alerts: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('user_settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (error) throw error;
                if (data) {
                    setProfile({
                        restaurant_name: data.restaurant_name,
                        location: data.location,
                        email_alerts: data.email_alerts
                    });
                    if (data.language) setLanguage(data.language);
                }
            } catch (err) {
                console.error('Error fetching settings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [user, setLanguage]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        setSaveSuccess(false);
        try {
            const { error } = await supabase
                .from('user_settings')
                .upsert({
                    user_id: user.id,
                    restaurant_name: profile.restaurant_name,
                    location: profile.location,
                    language: language,
                    email_alerts: profile.email_alerts,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Error saving settings:', err);
        } finally {
            setSaving(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative' }}
        >
            {/* Background Glow */}
            <div style={{ position: 'fixed', top: '15%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, hsla(var(--primary), 0.05) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(100px)', zIndex: -1 }}></div>
            <div style={{ position: 'fixed', bottom: '15%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, hsla(var(--vibrant-emerald), 0.04) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(100px)', zIndex: -1 }}></div>

            <motion.header variants={itemVariants} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.25rem', background: 'linear-gradient(to right, hsl(var(--foreground)), hsl(var(--muted-foreground)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {t('settings')}
                    </h1>
                    <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.125rem' }}>Fine-tune your experience and manage kitchen preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="flex-center glow"
                    style={{
                        padding: '1rem 2rem',
                        borderRadius: '14px',
                        background: saveSuccess ? '#10b981' : 'hsl(var(--primary))',
                        color: 'white',
                        border: 'none',
                        fontWeight: 800,
                        cursor: (saving || loading) ? 'not-allowed' : 'pointer',
                        gap: '0.75rem',
                        boxShadow: saveSuccess ? '0 8px 16px -4px rgba(16, 185, 129, 0.4)' : '0 8px 16px -4px rgba(59, 130, 246, 0.4)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {saveSuccess ? <CheckCircle2 size={20} /> : saving ? <div className="animate-spin" style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></div> : <Save size={20} />}
                    <span style={{ fontSize: '1.05rem' }}>{saveSuccess ? 'Saved Successfully' : saving ? 'Saving Preferences...' : t('saveSettings')}</span>
                </button>
            </motion.header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '1200px' }}>
                <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                        <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)' }}>
                            <Globe size={22} color="#3b82f6" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('language')}</h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderRadius: '18px', background: 'var(--glass-bg-subtle)', border: '1px solid var(--glass-border-subtle)' }}>
                        <div>
                            <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{t('selectLanguage')}</p>
                            <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>System-wide display language</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--input-bg)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--glass-border-subtle)' }}>
                            <button
                                onClick={() => setLanguage('en')}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: language === 'en' ? 'hsl(var(--primary))' : 'transparent',
                                    color: language === 'en' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                                    cursor: 'pointer',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {t('english')}
                            </button>
                            <button
                                onClick={() => setLanguage('hi')}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: language === 'hi' ? 'hsl(var(--primary))' : 'transparent',
                                    color: language === 'hi' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                                    cursor: 'pointer',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {t('hindi')}
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                        <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)' }}>
                            <User size={22} color="#10b981" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Restaurant Profile</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'hsl(var(--muted-foreground))', marginBottom: '0.75rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Restaurant Name</label>
                            <input
                                type="text"
                                value={profile.restaurant_name}
                                onChange={(e) => setProfile({ ...profile, restaurant_name: e.target.value })}
                                style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '14px', background: 'var(--input-bg)', border: '1px solid var(--glass-border-subtle)', color: 'hsl(var(--foreground))', fontWeight: 600, fontSize: '1rem' }}
                                placeholder="e.g. Spice Garden"
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'hsl(var(--muted-foreground))', marginBottom: '0.75rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</label>
                            <input
                                type="text"
                                value={profile.location}
                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '14px', background: 'var(--input-bg)', border: '1px solid var(--glass-border-subtle)', color: 'hsl(var(--foreground))', fontWeight: 600, fontSize: '1rem' }}
                                placeholder="City, Country"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                        <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(167, 139, 250, 0.1)' }}>
                            <Shield size={22} color="#a78bfa" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Account & Security</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderRadius: '18px', background: 'var(--glass-bg-subtle)', border: '1px solid var(--glass-border-subtle)' }}>
                        <div>
                            <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>Two-Factor Authentication</p>
                            <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>Add an extra layer of security</p>
                        </div>
                        <button style={{ color: 'hsl(var(--primary))', background: 'hsla(var(--primary), 0.1)', border: '1px solid hsla(var(--primary), 0.2)', padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>Enable Now</button>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                        <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)' }}>
                            <Bell size={22} color="#f59e0b" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Notifications</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderRadius: '18px', background: 'var(--glass-bg-subtle)', border: '1px solid var(--glass-border-subtle)' }}>
                        <div>
                            <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>Email Inventory Alerts</p>
                            <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>Notify when stock levels are critical</p>
                        </div>
                        <div
                            onClick={() => setProfile({ ...profile, email_alerts: !profile.email_alerts })}
                            style={{
                                width: '50px',
                                height: '26px',
                                background: profile.email_alerts ? 'hsl(var(--primary))' : 'var(--input-bg)',
                                borderRadius: '20px',
                                padding: '3px',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                position: 'relative',
                                border: '1px solid var(--glass-border-subtle)'
                            }}
                        >
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: 'white',
                                borderRadius: '50%',
                                transform: profile.email_alerts ? 'translateX(24px)' : 'translateX(0)',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}></div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SettingsPage;
