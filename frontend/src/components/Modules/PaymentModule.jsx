import React, { useState } from 'react';

const PaymentModule = () => {
    const [payments] = useState([
        { id: 'INV-2026-001', date: '2026-08-01', amount: '$199.00', plan: 'Platinum VIP Membership (1 Year)', status: 'Paid', method: 'Visa ending in 4242' },
        { id: 'INV-2026-002', date: '2026-07-01', amount: '$199.00', plan: 'Platinum VIP Membership (1 Month)', status: 'Paid', method: 'Razorpay UPI' },
        { id: 'INV-2026-003', date: '2026-06-01', amount: '$199.00', plan: 'Platinum VIP Membership (1 Month)', status: 'Paid', method: 'Stripe Card' },
    ]);

    const [paymentGateway, setPaymentGateway] = useState('Stripe');
    const [successMsg, setSuccessMsg] = useState('');

    const triggerPayment = (gate) => {
        setPaymentGateway(gate);
        setSuccessMsg(`Simulated ${gate} payment gateway initialized. Subscription renewed successfully!`);
        setTimeout(() => setSuccessMsg(''), 5000);
    };

    return (
        <div className="vstack gap-4 animate-fade-in">
            {successMsg && (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 font-bold flex items-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                    <i className="bi bi-check-circle-fill text-emerald-400 text-lg"></i>
                    <span>{successMsg}</span>
                </div>
            )}

            {/* Renew Membership & Payment Gateways */}
            <div className="glass-card p-4">
                <div className="row align-items-center g-4">
                    <div className="col-lg-7">
                        <span className="badge bg-accent text-dark fw-bold mb-2">ACTIVE SUBSCRIPTION</span>
                        <h3 className="fw-bold text-white mb-1">Platinum VIP Health Pass</h3>
                        <p className="text-zinc-300 small mb-3">
                            Full access to AI biometric tracking, recovery sauna lounge, personal trainers, and custom meal plans.
                        </p>
                        <div className="d-flex gap-2">
                            <button className="btn btn-accent" onClick={() => triggerPayment('Stripe')}>
                                <i className="bi bi-stripe me-1"></i>Pay via Stripe ($199)
                            </button>
                            <button className="btn btn-outline-light text-white" onClick={() => triggerPayment('Razorpay')}>
                                <i className="bi bi-wallet2 me-1"></i>Pay via Razorpay
                            </button>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="p-3 bg-dark rounded-3 border border-secondary text-center">
                            <span className="text-zinc-300 small font-bold">DAYS REMAINING</span>
                            <h1 className="fw-extrabold text-accent display-5 mb-0">120</h1>
                            <span className="text-zinc-400" style={{ fontSize: '0.75rem' }}>Auto-Renewal Enabled • Expires Dec 2026</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing & Invoice History */}
            <div className="glass-card p-4">
                <h5 className="fw-bold text-white mb-3"><i className="bi bi-receipt-cutoff text-accent me-2"></i>Payment History & Receipts</h5>
                <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                        <thead className="text-zinc-300 small text-uppercase">
                            <tr>
                                <th className="bg-transparent text-zinc-300">Invoice ID</th>
                                <th className="bg-transparent text-zinc-300">Date</th>
                                <th className="bg-transparent text-zinc-300">Membership Plan</th>
                                <th className="bg-transparent text-zinc-300">Amount</th>
                                <th className="bg-transparent text-zinc-300">Method</th>
                                <th className="bg-transparent text-zinc-300">Status</th>
                                <th className="bg-transparent text-zinc-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p) => (
                                <tr key={p.id} className="border-secondary border-opacity-50">
                                    <td className="bg-transparent text-accent font-mono fw-bold">{p.id}</td>
                                    <td className="bg-transparent text-zinc-200 small font-medium">{p.date}</td>
                                    <td className="bg-transparent text-white font-medium">{p.plan}</td>
                                    <td className="bg-transparent text-white fw-bold">{p.amount}</td>
                                    <td className="bg-transparent text-zinc-200 small font-medium">{p.method}</td>
                                    <td className="bg-transparent">
                                        <span className="badge bg-success">{p.status}</span>
                                    </td>
                                    <td className="bg-transparent">
                                        <button className="btn btn-sm btn-outline-light" onClick={() => alert(`Downloading Receipt for ${p.id}`)}>
                                            <i className="bi bi-download me-1"></i>Receipt
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentModule;
