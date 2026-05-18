import React from 'react';
import clsx from 'clsx';

interface ASRInteriorsLogoProps {
    className?: string;
}

const ASRInteriorsLogo: React.FC<ASRInteriorsLogoProps> = ({ className }) => {
    return (
        <div className={clsx('flex items-center gap-3', className)}>
            {/* Monogram Mark */}
            <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    {/* Gold horizontal bar — the signature ASR brand element */}
                    <line x1="4" y1="22" x2="36" y2="22" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" />
                    {/* A */}
                    <path d="M6 32 L13 8 L20 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <line x1="8.5" y1="24" x2="17.5" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    {/* S — overlapping gold */}
                    <path d="M21 14 C21 11 24 10 27 11 C30 12 31 14 29 16 C27 18 24 18 22 20 C20 22 21 25 24 26 C27 27 30 26 31 24"
                        stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" fill="none" />
                    {/* R */}
                    <path d="M33 32 L33 8 L36 8 C38 8 40 10 40 13 C40 16 38 18 36 18 L33 18 M36 18 L40 32"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
            </div>
            {/* Wordmark */}
            <div className="flex flex-col leading-none">
                <span
                    className="text-[13px] font-black tracking-[0.18em] text-text-primary uppercase"
                    style={{ fontFamily: 'var(--font-sans)' }}
                >
                    ASR
                </span>
                <span
                    className="text-[9px] font-semibold tracking-[0.12em] text-text-muted uppercase mt-0.5"
                    style={{ color: '#C9A84C' }}
                >
                    Interiors
                </span>
            </div>
        </div>
    );
};

export default ASRInteriorsLogo;
