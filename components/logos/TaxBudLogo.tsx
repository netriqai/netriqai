import React from 'react';
import clsx from 'clsx';

interface TaxBudLogoProps {
    className?: string;
}

const TaxBudLogo: React.FC<TaxBudLogoProps> = ({
    className,
}) => {
    return (
        <div
            className={clsx(
                'flex items-center transition-all group',
                className,
            )}
        >
            <img
                src="/logos/taxbud_koala.png"
                alt="TaxBud Koala"
                className="aspect-square object-contain shrink-0 transition-all duration-500 ease-out h-10 sm:h-12"
            />

            <div className="flex flex-col items-start leading-none ml-2">
                <div className="text-2xl sm:text-3xl font-black tracking-tighter flex items-center">
                    {/* Using text-text-primary to automatically switch between black (day) and white (night) */}
                    <span className="text-text-primary">Tax</span>
                    <span className="text-[rgb(var(--accent-blue))]">Bud</span>
                </div>
            </div>
        </div>
    );
};

export default TaxBudLogo;
