import React from 'react';
import { LayoutDashboard, Package, BarChart3, Settings, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
    currentView: 'dashboard' | 'inventory' | 'analytics' | 'settings';
    onViewChange: (view: 'dashboard' | 'inventory' | 'analytics' | 'settings') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
    const { t } = useLanguage();

    const menuItems = [
        { id: 'dashboard' as const, icon: LayoutDashboard, label: t('dashboard') },
        { id: 'inventory' as const, icon: Package, label: t('inventoryOpt') },
        { id: 'analytics' as const, icon: BarChart3, label: t('analytics') },
        { id: 'settings' as const, icon: Settings, label: t('settings') },
    ];

    return (
        <aside className="glass" style={{
            position: 'fixed',
            top: '90px',
            left: '20px',
            bottom: '20px',
            width: '280px',
            padding: '1.75rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            zIndex: 1000,
            border: '1px solid var(--glass-border-subtle)',
            boxShadow: 'var(--glass-shadow)',
            borderRadius: '24px'
        }}>
            {menuItems.map((item, index) => {
                const isActive = currentView === item.id;
                return (
                    <button
                        key={index}
                        onClick={() => onViewChange(item.id)}
                        className={`flex-center ${isActive ? 'glow' : ''}`}
                        style={{
                            justifyContent: 'flex-start',
                            gap: '1.25rem',
                            padding: '1.125rem 1.5rem',
                            borderRadius: '16px',
                            border: '1px solid',
                            borderColor: isActive ? 'hsla(var(--primary), 0.3)' : 'transparent',
                            background: isActive ? 'linear-gradient(135deg, hsla(var(--primary), 0.15) 0%, hsla(var(--primary), 0.05) 100%)' : 'transparent',
                            color: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            width: '100%',
                            fontWeight: isActive ? 700 : 500,
                            letterSpacing: '0.01em'
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.background = 'var(--glass-bg-subtle)';
                                e.currentTarget.style.color = 'hsl(var(--foreground))';
                                e.currentTarget.style.transform = 'translateX(4px)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'hsl(var(--muted-foreground))';
                                e.currentTarget.style.transform = 'translateX(0)';
                            }
                        }}
                    >
                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? '#3b82f6' : 'inherit' }} />
                        <span style={{ fontSize: '1rem' }}>{item.label}</span>
                    </button>
                );
            })}

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border-subtle)' }}>
                <button
                    className="flex-center"
                    style={{
                        justifyContent: 'flex-start',
                        gap: '1.25rem',
                        padding: '1.125rem 1.5rem',
                        borderRadius: '16px',
                        border: 'none',
                        background: 'transparent',
                        color: 'hsl(var(--muted-foreground))',
                        cursor: 'pointer',
                        width: '100%',
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                >
                    <HelpCircle size={22} strokeWidth={2} />
                    <span style={{ fontSize: '1rem' }}>{t('support')}</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
