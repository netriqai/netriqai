import React from 'react';
import clsx from 'clsx';

interface FinvueLogoProps {
    className?: string;
}

const FinvueLogo: React.FC<FinvueLogoProps> = ({ className }) => {
    return (
        <div className={clsx('flex items-center gap-3', className)}>
            <div className="w-10 h-10 flex-shrink-0">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path
                        d="M26 16 A 10 10 0 1 1 16 6"
                        stroke="#2563EB"
                        strokeWidth="4"
                        fill="none"
                    />
                    <path
                        d="M 16,12 L 16,6 A 10,10 0 0 1 26,16 L 20,16 A 4,4 0 0 0 16,12 Z"
                        fill="#C04000"
                        stroke="none"
                    />
                    <circle
                        cx="16"
                        cy="16"
                        r="4"
                        fill="#60A5FA"
                    />
                </svg>
            </div>
            {/* Using text-text-primary to automatically switch between black (day) and white (night) */}
            <span className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-text-primary">
                Finvue
            </span>
        </div>
    );
};

export default FinvueLogo;
