import React from 'react';
import clsx from 'clsx';

interface HRFinanceLogoProps {
    className?: string;
}

const HRFinanceLogo: React.FC<HRFinanceLogoProps> = ({ className }) => {
    // Original filters from HR Finance project
    const navyFilter = "brightness(0) saturate(100%) invert(12%) sepia(40%) saturate(900%) hue-rotate(196deg) brightness(95%) contrast(105%)";
    const whiteFilter = "brightness(0) invert(1)";

    return (
        <div className={clsx('flex items-center', className)}>
            {/* Day Theme Logo (Navy) */}
            <img
                src="/logos/hrfinance.png"
                alt="H&R Finance"
                className="h-10 sm:h-12 w-auto object-contain dark:hidden"
                style={{ filter: navyFilter }}
            />
            {/* Night Theme Logo (White) */}
            <img
                src="/logos/hrfinance.png"
                alt="H&R Finance"
                className="h-10 sm:h-12 w-auto object-contain hidden dark:block"
                style={{ filter: whiteFilter }}
            />
        </div>
    );
};

export default HRFinanceLogo;
