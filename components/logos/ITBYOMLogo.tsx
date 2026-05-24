import React from 'react';
import clsx from 'clsx';

interface ITBYOMLogoProps {
    className?: string;
}

const ITBYOMLogo: React.FC<ITBYOMLogoProps> = ({ className }) => {
    return (
        <div className={clsx('flex items-center gap-3', className)}>
            <img
                src="/logos/itbyom.png"
                alt="itBYOM Logo"
                className="h-10 sm:h-12 w-auto object-contain"
            />
            {/* Using text-text-primary to automatically switch between black (day) and white (night) */}
            <span className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-text-primary">
                it<span className="text-[#d97706] dark:text-[#f59e0b]">BYOM</span>
            </span>
        </div>
    );
};

export default ITBYOMLogo;
