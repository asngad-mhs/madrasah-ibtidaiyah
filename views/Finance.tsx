
import React, { useState, useMemo } from 'react';
import { FINANCE_DATA } from '../constants.ts';
import type { Bill } from '../types.ts';
import { PaymentStatus } from '../types.ts';
import { CreditCardIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';

const Finance: React.FC = () => {
    const [bills, setBills] = useState<Bill[]>(FINANCE_DATA);
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

    const { totalUnpaid, nextDueDate } = useMemo(() => {
        const unpaidBills = bills.filter(b => b.status === PaymentStatus.BelumLunas);
        const total = unpaidBills.reduce((sum, bill) => sum + bill.amount, 0);

        const upcomingBills = unpaidBills
            .map(b => new Date(b.dueDate))
            .filter(d => d >= new Date())
            .sort((a, b) => a.getTime() - b.getTime());
            
        return {
            totalUnpaid: total,
            nextDueDate: upcomingBills.length > 0 ? upcomingBills[0] : null,
        };
    }, [bills]);

    const handlePayBill = (id: number) => {
        // In a real app, this would trigger a payment gateway.
        // For now, we'll just simulate the payment.
        setBills(bills.map(bill => 
            bill.id === id ? { ...bill, status: PaymentStatus.Lunas } : bill
        ));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const displayedBills = useMemo(() => {
        const sortedBills = [...bills].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        if (activeTab === 'active') {
            return sortedBills.filter(b => b.status === PaymentStatus.BelumLunas);
        }
        return sortedBills.filter(b => b.status === PaymentStatus.Lunas);
    }, [bills, activeTab]);

    const getStatusBadge = (status: PaymentStatus, dueDate: string) => {
        const isOverdue = new Date(dueDate) < new Date() && status === PaymentStatus.BelumLunas;
        if (isOverdue) {
            return <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">Jatuh Tempo</span>;
        }
        switch (status) {
            case PaymentStatus.Lunas:
                return <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">Lunas</span>;
            case PaymentStatus.BelumLunas:
                return <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">Belum Lunas</span>;
        }
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 text-center">Informasi Keuangan</h1>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-xl shadow-sm">
                    <h2 className="text-sm font-medium text-red-700">Total Tagihan</h2>
                    <p className="text-2xl font-bold text-red-900 mt-1">{formatCurrency(totalUnpaid)}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
                    <h2 className="text-sm font-medium text-blue-700">Jatuh Tempo Berikutnya</h2>
                    <p className="text-lg font-bold text-blue-900 mt-2">{nextDueDate ? formatDate(nextDueDate) : '-'}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center bg-gray-200 rounded-full p-1">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`w-full py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${activeTab === 'active' ? 'bg-teal-500 text-white shadow' : 'text-gray-600'}`}
                >
                    Tagihan Aktif
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`w-full py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${activeTab === 'history' ? 'bg-teal-500 text-white shadow' : 'text-gray-600'}`}
                >
                    Riwayat Pembayaran
                </button>
            </div>

            {/* Bill List */}
            <div className="space-y-3">
                {displayedBills.length > 0 ? (
                    displayedBills.map(bill => (
                        <div key={bill.id} className="bg-white rounded-xl shadow-md p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-800">{bill.description}</h3>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <CalendarDaysIcon className="w-4 h-4 mr-1" />
                                        <span>Jatuh Tempo: {formatDate(bill.dueDate)}</span>
                                    </div>
                                </div>
                                {getStatusBadge(bill.status, bill.dueDate)}
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <p className="text-lg font-semibold text-gray-700">{formatCurrency(bill.amount)}</p>
                                {bill.status === PaymentStatus.BelumLunas && (
                                    <button 
                                        onClick={() => handlePayBill(bill.id)}
                                        className="bg-green-500 text-white font-semibold py-1.5 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center"
                                    >
                                        <CreditCardIcon className="w-4 h-4 mr-2"/>
                                        Bayar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500">{activeTab === 'active' ? 'Tidak ada tagihan aktif.' : 'Belum ada riwayat pembayaran.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Finance;
