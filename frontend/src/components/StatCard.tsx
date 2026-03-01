import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    description?: string;
    color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendUp, icon: Icon, description, color = 'hsl(var(--primary))' }) => {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-card"
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'all 0.3s ease', boxShadow: 'var(--card-shadow)' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div className="flex-center" style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: `${color}15`,
                    color: color
                }}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: trendUp ? '#10b981' : '#ef4444',
                        background: trendUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '20px',
                        letterSpacing: '0.02em'
                    }}>
                        {trend}
                    </span>
                )}
            </div>

            <div>
                <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600, letterSpacing: '0.01em' }}>{label}</p>
                <h3 style={{ fontSize: '2.125rem', fontWeight: 900, margin: '0.25rem 0', letterSpacing: '-0.03em', color: 'hsl(var(--foreground))' }}>{value}</h3>
                {description && <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{description}</p>}
            </div>
        </motion.div>
    );
};

export default StatCard;
