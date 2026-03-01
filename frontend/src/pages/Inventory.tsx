import { useState, useEffect } from 'react';
import { Package, AlertCircle, TrendingUp, History, Download, ShoppingCart, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

interface InventoryItem {
    id: number;
    name: string;
    quantity: string;
    price_per_unit: string;
    expiry_date: string;
    status: string;
}

const Inventory = () => {
    const { t } = useLanguage();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('inventory')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) setInventory(data);
            } catch (err) {
                console.error('Error fetching inventory:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    const mockPredictions = [
        { item: 'Milk', recommendedQty: '20 Liters', reason: 'Weekend Surge Predicted', priority: 'High' },
        { item: 'Flour', recommendedQty: '50kg', reason: 'High Dosa Demand', priority: 'Medium' },
        { item: 'Onions', recommendedQty: '30kg', reason: 'Historical Trend', priority: 'Low' },
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
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative' }}
        >
            {/* Background Glow */}
            <div style={{ position: 'fixed', top: '20%', left: '50%', width: '500px', height: '500px', background: 'radial-gradient(circle, hsla(var(--vibrant-emerald), 0.06) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(80px)', zIndex: -1 }}></div>

            <motion.header variants={itemVariants} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.25rem', background: 'linear-gradient(to right, hsl(var(--foreground)), hsl(var(--muted-foreground)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {t('inventoryTitle')}
                    </h1>
                    <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.125rem', fontWeight: 500 }}>{t('inventorySub')}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="flex-center glass" style={{ padding: '0.875rem 1.5rem', gap: '0.75rem', cursor: 'pointer', border: '1px solid var(--glass-border-subtle)', color: 'hsl(var(--foreground))', borderRadius: '12px', fontWeight: 600 }}>
                        <Download size={18} strokeWidth={2.5} /> {t('export')}
                    </button>
                    <button className="flex-center glow" style={{ padding: '0.875rem 1.75rem', borderRadius: '14px', background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', border: 'none', fontWeight: 800, cursor: 'pointer', gap: '0.75rem', boxShadow: 'var(--card-shadow)' }}>
                        <ShoppingCart size={20} strokeWidth={2.5} /> {t('orderStock')}
                    </button>
                </div>
            </motion.header>

            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                <StatCard label={t('totalItems')} value={loading ? '...' : String(inventory.length)} icon={Package} color="#3b82f6" />
                <StatCard label={t('criticalItems')} value="3" icon={AlertCircle} trend="Action Required" color="#ef4444" trendUp={false} />
                <StatCard label={t('monthlySpend')} value="₹2,450" icon={History} color="#f59e0b" />
                <StatCard label={t('wastePrevented')} value="18%" trendUp={true} trend="+4%" icon={TrendingUp} color="#10b981" />
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.2fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
                <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('currentStock')}</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--muted-foreground))', background: 'var(--glass-bg-subtle)', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border-subtle)' }}>ALL ITEMS</span>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem', textAlign: 'left' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '0 1.25rem 1rem', color: 'hsl(var(--muted-foreground))', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('itemName')}</th>
                                    <th style={{ padding: '0 1.25rem 1rem', color: 'hsl(var(--muted-foreground))', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('quantity')}</th>
                                    <th style={{ padding: '0 1.25rem 1rem', color: 'hsl(var(--muted-foreground))', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('price')}</th>
                                    <th style={{ padding: '0 1.25rem 1rem', color: 'hsl(var(--muted-foreground))', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('expiry')}</th>
                                    <th style={{ padding: '0 1.25rem 1rem', color: 'hsl(var(--muted-foreground))', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted-foreground-subtle)', fontWeight: 600 }}>Loading live inventory...</td></tr>
                                ) : inventory.length === 0 ? (
                                    <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted-foreground-subtle)', fontWeight: 600 }}>No items found. Update logs to add stock.</td></tr>
                                ) : inventory.map((item) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        style={{ transition: 'all 0.2s', background: 'var(--glass-bg-subtle)', cursor: 'pointer' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--glass-bg-subtle)'}
                                    >
                                        <td style={{ padding: '1.25rem', fontWeight: 700, borderRadius: '12px 0 0 12px' }}>{item.name}</td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <span style={{ fontWeight: 600 }}>{item.quantity}</span>
                                        </td>
                                        <td style={{ padding: '1.25rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>₹{item.price_per_unit}/unit</td>
                                        <td style={{ padding: '1.25rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>{item.expiry_date}</td>
                                        <td style={{ padding: '1.25rem', borderRadius: '0 12px 12px 0' }}>
                                            <span style={{
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '10px',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                background: item.status === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : item.status === 'Expiring Soon' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                                color: item.status === 'Critical' ? '#ef4444' : item.status === 'Expiring Soon' ? '#f59e0b' : '#10b981',
                                                border: `1px solid ${item.status === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : item.status === 'Expiring Soon' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                            }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div>
                                                {item.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <motion.div variants={itemVariants} className="glass" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)' }}>
                                <Sparkles size={22} color="#10b981" fill="#10b981" />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t('restockPred')}</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {mockPredictions.map((pred, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 5, background: 'var(--input-bg)' }}
                                    style={{ padding: '1.25rem', borderRadius: '18px', background: 'var(--glass-bg-subtle)', border: '1px solid var(--glass-border-subtle)', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{pred.item}</p>
                                        <ChevronRight size={18} color="var(--muted-foreground-subtle)" />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>{pred.reason}</div>
                                        <span style={{ color: '#10b981', fontWeight: 900, fontSize: '1.25rem' }}>+{pred.recommendedQty}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className="glass-card"
                        style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: '6px solid #ef4444', background: 'rgba(239, 68, 68, 0.05)' }}
                    >
                        <AlertTriangle color="#ef4444" size={36} strokeWidth={2.5} />
                        <div>
                            <p style={{ fontWeight: 800, fontSize: '1.125rem', color: '#ef4444', marginBottom: '0.25rem' }}>{t('wasteAlert')}</p>
                            <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>3 items nearing expiry. Immediate review recommended to prevent loss.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Inventory;
