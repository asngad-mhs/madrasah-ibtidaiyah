
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface FeedbackModalProps {
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
    const [category, setCategory] = useState('Saran Fitur Baru');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() === '') {
            alert('Mohon isi pesan masukan Anda.');
            return;
        }
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            console.log({
                category,
                message
            });
            setIsSubmitting(false);
            alert('Terima kasih! Masukan Anda telah kami terima.');
            onClose();
        }, 1000);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md m-4 transform transition-all"  onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Beri Saran & Masukan</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-5 space-y-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Kategori
                            </label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            >
                                <option>Saran Fitur Baru</option>
                                <option>Lapor Masalah/Bug</option>
                                <option>Desain & Tampilan</option>
                                <option>Lainnya</option>
                            </select>
                        </div>
                        <div>
                             <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                Pesan Anda
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                                placeholder="Tuliskan saran atau masalah yang Anda temukan di sini..."
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                required
                            />
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-4 rounded-b-2xl">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                        >
                            {isSubmitting ? 'Mengirim...' : 'Kirim Masukan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;
