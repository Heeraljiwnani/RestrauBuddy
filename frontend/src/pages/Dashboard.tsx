import { useState, useEffect } from 'react';
import { TrendingUp, Clock, AlertTriangle, ListPlus, Sparkles } from 'lucide-react';
import StatCard from '../components/StatCard';
import DataEntryModal from '../components/DataEntryModal';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        inventoryEfficiency: "92.5%",
        avgOrderValue: 450,
        wasteStatus: "LOW"
    });
    const [liveData, setLiveData] = useState<any[]>([]);
    const [predictionResult, setPredictionResult] = useState({
        customers: 142,
        recommendations: [
            { dish: 'Biryani', predicted_quantity: 45, status: 'High Demand' },
            { dish: 'Paneer Butter Masala', predicted_quantity: 30, status: 'Trending' },
            { dish: 'Dosa', predicted_quantity: 60, status: 'Morning Peak' },
            { dish: 'Burger', predicted_quantity: 25, status: 'Stable' },
        ],
        summary: '',
        confidence: 94
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Sales Data for Chart
                const { data: salesData, error: salesError } = await supabase
                    .from('sales_logs')
                    .select('*')
                    .order('date', { ascending: true })
                    .limit(7);

                if (salesError) throw salesError;
                if (salesData) {
                    const formatted = salesData.map(log => ({
                        name: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
                        customers: log.total_customers,
                        forecast: log.total_customers + Math.floor(Math.random() * 10) - 5
                    }));
                    setLiveData(formatted);

                    const totalRev = salesData.reduce((acc, curr) => acc + curr.total_revenue, 0);
                    setStats(prev => ({ ...prev, totalRevenue: totalRev }));
                }

                // Fetch AI Predictions (Simulated via backend service)
                const mlApiUrl = import.meta.env.VITE_ML_API_URL || 'http://localhost:5001';
                const response = await fetch(`${mlApiUrl}/predict`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customers: 142,
                        is_festival: true,
                        unexpected_surge: false
                    })
                });
                const aiData = await response.json();
                if (aiData.recommendations) {
                    setPredictionResult(prev => ({
                        ...prev,
                        customers: aiData.customers,
                        recommendations: aiData.recommendations,
                        summary: aiData.summary,
                        confidence: 94
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch dashboard content:', err);
            }
        };
        fetchDashboardData();
    }, []);

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
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any } as any
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}
        >
            {/* Background Glows */}
            <div style={{ position: 'fixed', top: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, hsla(var(--primary), 0.08) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)', zIndex: -1 }}></div>
            <div style={{ position: 'fixed', bottom: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, hsla(var(--vibrant-emerald), 0.05) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)', zIndex: -1 }}></div>

            <motion.header variants={itemVariants} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.25rem', background: 'linear-gradient(to right, hsl(var(--foreground)), hsl(var(--muted-foreground)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {t('welcomeMsg')}
                    </h1>
                    <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.125rem', fontWeight: 500 }}>{t('dashboardSub')}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-center glow"
                    style={{
                        padding: '1rem 2rem',
                        borderRadius: '14px',
                        background: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                        border: 'none',
                        fontWeight: 800,
                        cursor: 'pointer',
                        gap: '0.75rem',
                        boxShadow: 'var(--card-shadow)',
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
                >
                    <ListPlus size={22} strokeWidth={2.5} />
                    <span style={{ fontSize: '1.05rem' }}>{t('updateLogs')}</span>
                </button>
            </motion.header>

            <DataEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <section style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)',
                gap: '1.5rem',
            }}>
                <motion.div variants={itemVariants} className="glass" style={{
                    padding: '2.5rem',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--glass-border-subtle)'
                }}>
                    <div style={{ position: 'absolute', bottom: '-20px', left: 0, right: 0, height: '60px', background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%233b82f6\' fill-opacity=\'0.1\' d=\'M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,160C672,128,768,96,864,106.7C960,117,1056,171,1152,181.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")', backgroundSize: 'cover', opacity: 0.5 }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#60a5fa', marginBottom: '1rem' }}>
                            <Sparkles size={18} fill="#60a5fa" />
                            <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.2em' }}>{t('demandPrediction')}</span>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'hsl(var(--foreground))' }}>{t('expectedFootfall')}</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', position: 'relative', zIndex: 1 }}>
                        <div style={{ background: 'var(--glass-bg-subtle)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--glass-border-subtle)' }}>
                            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>Current Forecast</p>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                                <span style={{ fontSize: '4.5rem', fontWeight: 950, letterSpacing: '-0.05em', background: 'linear-gradient(to bottom, hsl(var(--foreground)), hsl(var(--muted-foreground)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    {predictionResult.customers}
                                </span>
                                <span style={{ color: '#10b981', fontWeight: 800, fontSize: '1.25rem', padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '20px' }}>+12%</span>
                            </div>
                        </div>
                        <div style={{ background: 'var(--glass-bg-subtle)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--glass-border-subtle)' }}>
                            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>{t('confidenceScore')}</p>
                            <span style={{ fontSize: '4.5rem', fontWeight: 950, letterSpacing: '-0.05em', background: 'linear-gradient(to bottom, hsl(var(--foreground)), hsl(var(--muted-foreground)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {predictionResult.confidence}<span style={{ fontSize: '2rem' }}>%</span>
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#f59e0b' }}>
                        <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)' }}>
                            <AlertTriangle size={24} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>{t('unexpectedHappenings')}</span>
                    </div>
                    <div style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                        <p style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem', color: '#f59e0b' }}>{predictionResult.summary || 'Regional Festival (Holi)'}</p>
                        <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>AI has automatically adjusted prep quantities to account for the festival surge.</p>
                    </div>
                </motion.div>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)' }}>
                                <Clock size={20} color="#3b82f6" />
                            </div>
                            {t('prepQuantities')}
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>LIVE SYNC</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        {predictionResult.recommendations.map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02, background: 'var(--glass-bg-subtle)' }}
                                style={{
                                    padding: '1.25rem',
                                    borderRadius: '18px',
                                    background: 'var(--glass-bg-subtle)',
                                    border: '1px solid var(--glass-border-subtle)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600, marginBottom: '0.75rem' }}>{item.dish}</p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{item.predicted_quantity} <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>plates</span></span>
                                    <div style={{
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '10px',
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        background: item.status === 'High Demand' ? 'rgba(16, 185, 129, 0.1)' : 'var(--glass-bg-subtle)',
                                        color: item.status === 'High Demand' ? '#10b981' : 'hsl(var(--muted-foreground))'
                                    }}>
                                        {item.status.toUpperCase()}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)' }}>
                                <TrendingUp size={20} color="#10b981" />
                            </div>
                            Performance Flow
                        </h3>
                    </div>
                    <div style={{ width: '100%', height: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={liveData.length > 0 ? liveData : []}>
                                <defs>
                                    <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground-subtle)', fontSize: 12 }} dy={10} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: 'hsl(var(--foreground))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 700 }}
                                />
                                <Area type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrimary)" />
                                <Area type="monotone" dataKey="forecast" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                        {liveData.length === 0 && (
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--muted-foreground-subtle)', fontWeight: 600 }}>
                                {t('updateLogs')} to see data
                            </div>
                        )}
                    </div>
                </motion.div>
            </section>

            <motion.div
                variants={itemVariants}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}
            >
                <StatCard label={t('totalRevenue')} value={`₹${stats.totalRevenue.toLocaleString()}`} icon={TrendingUp} color="#3b82f6" trend="+12%" trendUp={true} />
                <StatCard label={t('inventoryEfficiency')} value={stats.inventoryEfficiency} icon={TrendingUp} color="#10b981" />
                <StatCard label={t('avgOrderValue')} value={`₹${stats.avgOrderValue}`} icon={Sparkles} color="#f59e0b" />
                <StatCard label={t('wasteAlert')} value={stats.wasteStatus} icon={AlertTriangle} color="#60a5fa" />
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
