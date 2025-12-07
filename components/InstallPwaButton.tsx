
import React from 'react';
import DownloadIcon from './icons/DownloadIcon.tsx';

interface InstallButtonProps {
    onClick: () => void;
}

const InstallPwaButton: React.FC<InstallButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-5 right-5 z-50 bg-teal-500 text-white p-4 rounded-full shadow-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform duration-200 ease-in-out transform hover:scale-110"
            aria-label="Instal Aplikasi"
            title="Instal Aplikasi"
        >
            <DownloadIcon />
        </button>
    );
};

export default InstallPwaButton;
