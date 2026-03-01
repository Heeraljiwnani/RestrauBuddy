import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Trash2, Calendar, Filter } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RePieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const Analytics = () => {
    const { t } = useLanguage();
    const [salesData, setSalesData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        revenue: 0,
        profit: 0,
        waste: 1630,
        avgOrder: 420
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('sales_logs')
                    .select('*')
                    .order('date', { ascending: true });

                if (error) throw error;
                if (data && data.length > 0) {
                    const formatted = data.map((log: any) => ({
                        name: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
                        revenue: log.total_revenue,
                        profit: log.total_revenue * 0.35,
                        waste: log.total_revenue * 0.05
                    }));
                    setSalesData(formatted);

                    const totalRev = data.reduce((acc, curr) => acc + curr.total_revenue, 0);
                    setStats(prev => ({
                        ...prev,
                        revenue: totalRev,
                        profit: totalRev * 0.35
                    }));
                }
            } catch (err) {
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const wasteData = [
        { name: 'Expiring', value: 45, color: '#f59e0b' },
        { name: 'Damaged', value: 25, color: '#ef4444' },
        { name: 'Prep Error', value: 30, color: '#3b82f6' },
    ];

    const dishSales = [
        { name: 'Biryani', sales: 450, growth: '+15%', color: '#3b82f6' },
        { name: 'Paneer Masala', sales: 320, growth: '+22%', color: '#10b981' },
        { name: 'Dosa', sales: 610, growth: '+5%', color: '#f59e0b' },
        { name: 'Burgers', sales: 210, growth: '-8%', color: '#ef4444' },
    ];

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
            {/* Background Glows */}
            <div style={{ position: 'fixed', top: '15%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, hsla(var(--primary), 0.08) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(80px)', zIndex: -1 }}></div>
            <div style={{ position: 'fixed', bottom: '10%', left: '10%', width: '350px', height: '350px', background: 'radial-gradient(circle, hsla(var(--vibrant-rose), 0.05) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(80px)', zIndex: -1 }}></div>

            <motion.header variants={itemVariants} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.25rem', background: 'linear-gradient(to right, hsl(var(--foreground)), hsl(var(--muted-foreground)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {t('analytics')}
                    </h1>
                    <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.125rem' }}>Full visibility into your kitchen's financial and operational performance.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="flex-center glass" style={{ padding: '0.75rem 1.25rem', gap: '0.75rem', borderRadius: '12px', color: 'hsl(var(--foreground))', fontWeight: 600, border: '1px solid var(--glass-border-subtle)' }}>
                        <Calendar size={18} /> Last 7 Days
                    </button>
                    <button className="flex-center glass" style={{ padding: '0.75rem 1.25rem', gap: '0.75rem', borderRadius: '12px', color: 'hsl(var(--foreground))', fontWeight: 600, border: '1px solid var(--glass-border-subtle)' }}>
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </motion.header>

            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                <StatCard label={t('totalRevenue')} value={loading ? '...' : `₹${stats.revenue.toLocaleString()}`} trend="+12.5%" trendUp={true} icon={DollarSign} color="#3b82f6" />
                <StatCard label={t('netProfit')} value={loading ? '...' : `₹${Math.round(stats.profit).toLocaleString()}`} trend="+18.2%" trendUp={true} icon={TrendingUp} color="#10b981" />
                <StatCard label={t('wasteCost')} value={`₹${stats.waste}`} trend="-22%" trendUp={true} icon={Trash2} color="#ef4444" />
                <StatCard label={t('avgOrder')} value={`₹${stats.avgOrder}`} trend="+3%" trendUp={true} icon={BarChart3} color="#f59e0b" />
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2.5rem', height: '500px', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('revenueVsProfit')}</h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'hsl(var(--primary))' }}></div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--muted-foreground))' }}>REVENUE</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }}></div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--muted-foreground))' }}>PROFIT</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            {loading ? (
                                <div className="flex-center" style={{ height: '100%', color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>Analyzing trends...</div>
                            ) : salesData.length === 0 ? (
                                <div className="flex-center" style={{ height: '100%', color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>No data in Supabase. Record a daily report to see results.</div>
                            ) : (
                                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border-subtle)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--muted-foreground-subtle)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="var(--muted-foreground-subtle)" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: 'hsl(var(--foreground))' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 700 }}
                                    />
                                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={32} />
                                    <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Waste Breakdown</h3>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ position: 'relative', height: '220px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={wasteData}
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {wasteData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: 'hsl(var(--foreground))' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 700 }}
                                    />
                                </RePieChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <span style={{ fontSize: '1.75rem', fontWeight: 900, display: 'block', color: 'hsl(var(--foreground))' }}>100%</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase' }}>Analyzed</span>
                            </div>
                        </div>
                        <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                            {wasteData.map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', borderRadius: '14px', background: 'var(--glass-bg-subtle)', border: '1px solid var(--glass-border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, boxShadow: `0 0 10px ${item.color}` }}></div>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.name}</span>
                                    </div>
                                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(167, 139, 250, 0.1)' }}>
                            <PieChart size={22} color="#a78bfa" />
                        </div>
                        {t('topSelling')}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {dishSales.map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ x: 5 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 900, color: item.color }}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{item.name}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>{item.sales} units sold</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: item.growth.startsWith('+') ? '#10b981' : '#ef4444', background: item.growth.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                                    {item.growth.startsWith('+') ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
                                    <span>{item.growth}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    className="glass"
                    style={{
                        padding: '3rem',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.02) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '1.5rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}
                >
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                        <TrendingUp size={32} strokeWidth={2.5} />
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{t('strategyHint')}</h3>
                    <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.05rem', lineHeight: '1.7', fontWeight: 600 }}>
                        Your profit margin is highest on <strong>Biryani</strong> and <strong>Paneer Masala</strong>.
                        However, <strong>Burgers</strong> are seeing a decline. We suggest a limited-time
                        "Biryani Combo" to drive cross-sales during the upcoming surge.
                    </p>
                    <button style={{ alignSelf: 'flex-start', background: '#10b981', color: 'white', border: 'none', padding: '0.875rem 1.75rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.4)' }}>
                        Apply Strategy
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Analytics;
