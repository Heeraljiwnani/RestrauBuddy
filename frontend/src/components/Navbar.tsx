import { Bell, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="glass" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2.5rem',
            zIndex: 1000,
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderRadius: 0,
            background: 'var(--glass-bg)',
            borderBottom: '1px solid var(--glass-border)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Logo size={42} />
                <span style={{ fontSize: '1.625rem', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(to right, hsl(var(--foreground)), hsl(var(--muted-foreground)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Restrau<span style={{ color: 'hsl(var(--primary))', WebkitTextFillColor: 'initial' }}>Buddy</span>
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
                <button
                    onClick={toggleTheme}
                    className="flex-center glass"
                    style={{
                        padding: '0.6rem',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)',
                        color: 'hsl(var(--foreground))',
                        background: 'var(--glass-bg-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="flex-center" style={{
                    background: 'none',
                    border: 'none',
                    color: 'hsl(var(--muted-foreground))',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                }}>
                    <Bell size={20} />
                    <span style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: 8,
                        height: 8,
                        background: 'hsl(var(--primary))',
                        borderRadius: '50%',
                        border: '2px solid hsl(var(--background))'
                    }}></span>
                </button>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '0.5rem 1.125rem',
                    borderRadius: '14px',
                    background: 'var(--muted)',
                    border: '1px solid var(--glass-border)'
                }}>
                    <div className="flex-center" style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: 'hsl(var(--primary))',
                        color: 'white'
                    }}>
                        <User size={18} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Kitchen Manager</span>
                        <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                            {user?.email}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => signOut()}
                    className="flex-center"
                    style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.15)',
                        color: '#ef4444',
                        padding: '0.6rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    title="Sign Out"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
