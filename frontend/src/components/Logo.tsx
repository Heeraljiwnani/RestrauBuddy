import React from 'react';

interface LogoProps {
    size?: number;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = '' }) => {
    return (
        <div
            className={`flex-center ${className}`}
            style={{
                width: size,
                height: size,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}
            >
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="25%" stopColor="#FDE68A" />
                        <stop offset="50%" stopColor="#D97706" />
                        <stop offset="75%" stopColor="#FCD34D" />
                        <stop offset="100%" stopColor="#B45309" />
                    </linearGradient>
                    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Golden Chef Hat Shape - High Fidelity */}
                <path
                    d="M50 12C32 12 22 24 22 36C22 42 25 47 30 51V78C30 82 33 85 37 85H63C67 85 70 82 70 78V51C75 47 78 42 78 36C78 24 68 12 50 12ZM42 58C42 58 45 55 50 55C55 55 58 58 58 58M37 78V54H63V78H37ZM50 19C63 19 71 27 71 36C71 40 68 44 64 47L61 48V54H39V48L36 47C32 44 29 40 29 36C29 27 37 19 50 19Z"
                    fill="url(#goldGradient)"
                    style={{ filter: 'url(#goldGlow)' }}
                />

                {/* Decorative horizontal lines on the hat base */}
                <rect x="37" y="62" width="26" height="1.5" fill="#FDE68A" opacity="0.6" />
                <rect x="37" y="68" width="26" height="1.5" fill="#FDE68A" opacity="0.6" />
                <rect x="37" y="74" width="26" height="1.5" fill="#FDE68A" opacity="0.6" />
            </svg>
        </div>
    );
};

export default Logo;
