import React, { useState } from 'react';
import { validateAppointmentDate, validateText } from '../../utils/validation';

const AppointmentModule = ({ role }) => {
    const [appointments, setAppointments] = useState([
        { id: 101, trainer: 'Marcus Vance', member: 'Alex Mercer', date: '2026-08-07', time: '10:00 AM', purpose: 'Hypertrophy Form & Deadlift Audit', status: 'Approved' },
        { id: 102, trainer: 'Elena Rostova', member: 'Sarah Jenkins', date: '2026-08-08', time: '02:30 PM', purpose: 'Nutritional Macro Optimization', status: 'Pending' },
        { id: 103, trainer: 'Marcus Vance', member: 'David Miller', date: '2026-08-09', time: '05:00 PM', purpose: 'VO2 Max Cardio Testing', status: 'Rejected' },
    ]);

    const [booking, setBooking] = useState({ trainer: 'Marcus Vance', date: '', time: '10:00 AM', purpose: '' });
    const [msg, setMsg] = useState(null);

    const handleBook = (e) => {
        e.preventDefault();

        // 1. Validate Appointment Date
        const dateVal = validateAppointmentDate(booking.date);
        if (!dateVal.valid) {
            setMsg({ type: 'warning', text: dateVal.message });
            setTimeout(() => setMsg(null), 5000);
            return;
        }

        // 2. Validate Purpose / Focus Text
        const purposeVal = validateText(booking.purpose, 'Purpose / Focus', 3, 100);
        if (!purposeVal.valid) {
            setMsg({ type: 'warning', text: purposeVal.message });
            setTimeout(() => setMsg(null), 5000);
            return;
        }

        const newAppt = {
            id: Date.now(),
            trainer: booking.trainer,
            member: 'Alex Mercer',
            date: booking.date,
            time: booking.time,
            purpose: booking.purpose.trim(),
            status: 'Pending',
        };
        setAppointments([newAppt, ...appointments]);
        setMsg({ type: 'success', text: 'Appointment booking submitted successfully! Pending trainer approval.' });
        setBooking({ trainer: 'Marcus Vance', date: '', time: '10:00 AM', purpose: '' });
        setTimeout(() => setMsg(null), 5000);
    };

    const updateStatus = (id, newStatus) => {
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
    };

    return (
        <div className="vstack gap-4 animate-fade-in">
            {msg && (
                <div className={`p-4 rounded-2xl border font-bold flex items-center gap-3 transition-all ${
                    msg.type === 'warning' 
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' 
                        : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                }`}>
                    <i className={`text-lg ${msg.type === 'warning' ? 'bi bi-exclamation-triangle-fill text-amber-400' : 'bi bi-check-circle-fill text-emerald-400'}`}></i>
                    <span>{typeof msg === 'object' ? msg.text : msg}</span>
                </div>
            )}

            {/* Book Appointment Form (For Members) */}
            {(role === 'MEMBER' || role === 'ADMIN') && (
                <div className="glass-card p-4">
                    <h5 className="fw-bold text-white mb-3"><i className="bi bi-calendar-plus-fill text-accent me-2"></i>Schedule 1-on-1 AI Trainer Session</h5>
                    <form onSubmit={handleBook} className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label text-zinc-200 font-semibold small">Select Certified Trainer</label>
                            <select
                                className="form-select bg-dark text-white border-secondary"
                                value={booking.trainer}
                                onChange={(e) => setBooking({ ...booking, trainer: e.target.value })}
                            >
                                <option value="Marcus Vance">Marcus Vance (Resistance Master)</option>
                                <option value="Elena Rostova">Elena Rostova (Bio-Metrics & Diet)</option>
                                <option value="John Wick">John Wick (Tactical Conditioning)</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label text-zinc-200 font-semibold small">Session Date</label>
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                className="form-control bg-dark text-white border-secondary"
                                value={booking.date}
                                onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label text-zinc-200 font-semibold small">Time Slot</label>
                            <select
                                className="form-select bg-dark text-white border-secondary"
                                value={booking.time}
                                onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                            >
                                <option value="09:00 AM">09:00 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="02:30 PM">02:30 PM</option>
                                <option value="05:00 PM">05:00 PM</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label text-zinc-200 font-semibold small">Purpose / Focus</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="e.g. Squat Form check"
                                value={booking.purpose}
                                onChange={(e) => setBooking({ ...booking, purpose: e.target.value })}
                            />
                        </div>

                        <div className="col-12 text-end">
                            <button type="submit" className="btn btn-accent">Submit Booking Request</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Appointment Requests Table */}
            <div className="glass-card p-4">
                <h5 className="fw-bold text-white mb-3"><i className="bi bi-clock-history text-accent me-2"></i>Appointments & Consultations</h5>
                <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                        <thead className="text-zinc-300 small text-uppercase">
                            <tr>
                                <th className="bg-transparent text-zinc-300">Trainer</th>
                                <th className="bg-transparent text-zinc-300">Member</th>
                                <th className="bg-transparent text-zinc-300">Date & Time</th>
                                <th className="bg-transparent text-zinc-300">Purpose</th>
                                <th className="bg-transparent text-zinc-300">Status</th>
                                {(role === 'TRAINER' || role === 'ADMIN') && <th className="bg-transparent text-zinc-300">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((a) => (
                                <tr key={a.id} className="border-secondary border-opacity-50">
                                    <td className="bg-transparent text-white fw-bold">{a.trainer}</td>
                                    <td className="bg-transparent text-zinc-100 font-medium">{a.member}</td>
                                    <td className="bg-transparent text-zinc-200 font-semibold small">{a.date} @ {a.time}</td>
                                    <td className="bg-transparent text-zinc-200 small">{a.purpose}</td>
                                    <td className="bg-transparent">
                                        <span className={`badge ${a.status === 'Approved' ? 'bg-success' : a.status === 'Pending' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                            {a.status}
                                        </span>
                                    </td>
                                    {(role === 'TRAINER' || role === 'ADMIN') && (
                                        <td className="bg-transparent">
                                            {a.status === 'Pending' && (
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-success" onClick={() => updateStatus(a.id, 'Approved')}>Approve</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => updateStatus(a.id, 'Rejected')}>Reject</button>
                                                </div>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AppointmentModule;
