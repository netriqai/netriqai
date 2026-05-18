import React from 'react';
import clsx from 'clsx';

interface ASRInteriorsLogoProps {
    className?: string;
}

const ASRInteriorsLogo: React.FC<ASRInteriorsLogoProps> = ({ className }) => {
    return (
        <div className={clsx('flex items-center justify-center bg-white p-1 rounded-lg shadow-sm', className)}>
            <img
                src="/logos/asrinteriors.jpg"
                alt="ASR Interiors"
                className="h-9 sm:h-10 w-auto object-contain"
            />
        </div>
    );
};

export default ASRInteriorsLogo;
