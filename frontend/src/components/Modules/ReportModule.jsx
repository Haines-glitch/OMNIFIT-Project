import React, { useState, useEffect } from 'react';
import { getTrainerAssignedMembers, getTrainerDashboardData } from '../../services/dashboardService';
import LoginService from '../Login/LoginService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportModule = ({ role = 'TRAINER', theme = 'dark' }) => {
    const isTrainer = role === 'TRAINER';
    const currentUser = LoginService.getCurrentUser();
    const trainerName = currentUser?.name || currentUser?.full_name || 'Vikram Rathore';

    // State
    const [assignedAthletes, setAssignedAthletes] = useState([]);
    const [selectedAthlete, setSelectedAthlete] = useState('ALL');
    const [selectedReportType, setSelectedReportType] = useState('workout');
    const [timeframe, setTimeframe] = useState('30d');
    const [isGenerating, setIsGenerating] = useState(false);
    const [downloadMsg, setDownloadMsg] = useState(null);

    // Load assigned athletes
    useEffect(() => {
        getTrainerAssignedMembers().then(res => {
            const list = res?.data || res || [];
            if (list.length > 0) {
                setAssignedAthletes(list);
            }
        }).catch(err => {
            console.warn('Could not load assigned members for report:', err);
        });
    }, []);

    const reportOptions = [
        {
            id: 'workout',
            name: 'Athlete Routine & Overload Completion',
            desc: 'Prescribed daily exercises, target load, sets, reps, and athlete completion status.',
            icon: 'bi-lightning-charge-fill',
            color: '#FF1E28'
        },
        {
            id: 'attendance',
            name: 'Facility Attendance & Session Consistency',
            desc: 'Contactless check-in records, weekly session frequency, and active training streaks.',
            icon: 'bi-calendar-check-fill',
            color: '#3B82F6'
        },
        {
            id: 'biometrics',
            name: 'Athlete Biometric & Overload Progression',
            desc: 'Starting vs current body weight, BMI progression, and strength overload gains.',
            icon: 'bi-graph-up-arrow',
            color: '#10B981'
        },
        {
            id: 'appointments',
            name: '1-on-1 Coaching Appointments Log',
            desc: 'Approved, completed, and pending coaching sessions with assigned athletes.',
            icon: 'bi-clock-history',
            color: '#F59E0B'
        }
    ];

    // Mock/Real Combined Data Source for preview
    const sampleWorkoutLogs = [
        { date: '2026-10-23', athlete: 'Haines Jose', routine: 'Chest & Triceps Hypertrophy', exercise: 'Incline Dumbbell Press', setsReps: '4 x 10-12', load: '26 kg', status: 'Completed', notes: 'Maintain 30-degree incline' },
        { date: '2026-10-23', athlete: 'Haines Jose', routine: 'Chest & Triceps Hypertrophy', exercise: 'Weighted Tricep Dips', setsReps: '3 x 12', load: '+15 kg', status: 'Pending', notes: 'Full depth lockout' },
        { date: '2026-10-22', athlete: 'Sarah Jenkins', routine: 'Posterior Chain Overload', exercise: 'Barbell Romanian Deadlift', setsReps: '4 x 8', load: '60 kg', status: 'Completed', notes: 'Neutral spine, hinge hips' },
        { date: '2026-10-22', athlete: 'Sarah Jenkins', routine: 'Posterior Chain Overload', exercise: 'Bulgarian Split Squats', setsReps: '3 x 10', load: '16 kg', status: 'Completed', notes: 'Knee stability' },
        { date: '2026-10-21', athlete: 'Marcus Vance', routine: 'Push Power Foundation', exercise: 'Overhead Barbell Press', setsReps: '4 x 6', load: '50 kg', status: 'Completed', notes: 'Strict vertical bar path' },
        { date: '2026-10-20', athlete: 'Alex Mercer', routine: 'Hypertrophy Back & Biceps', exercise: 'Seated Cable Row', setsReps: '4 x 12', load: '45 kg', status: 'Completed', notes: 'Squeeze rhomboids' },
    ];

    const sampleAttendanceLogs = [
        { date: '2026-10-23', athlete: 'Haines Jose', time: '08:15 AM', session: '1h 20m', terminal: 'Terminal 1 - Main Gate', status: 'Verified' },
        { date: '2026-10-22', athlete: 'Sarah Jenkins', time: '07:45 AM', session: '1h 10m', terminal: 'Terminal 2 - Iron Bay', status: 'Verified' },
        { date: '2026-10-21', athlete: 'Sarah Jenkins', time: '08:00 AM', session: '1h 15m', terminal: 'Terminal 1 - Main Gate', status: 'Verified' },
        { date: '2026-10-20', athlete: 'Marcus Vance', time: '09:30 AM', session: '1h 05m', terminal: 'Terminal 1 - Main Gate', status: 'Verified' },
        { date: '2026-10-19', athlete: 'Alex Mercer', time: '07:30 AM', session: '1h 30m', terminal: 'Terminal 2 - Iron Bay', status: 'Verified' },
    ];

    // Filter preview records
    const filteredWorkoutLogs = sampleWorkoutLogs.filter(row => {
        if (selectedAthlete === 'ALL') return true;
        return row.athlete.toLowerCase().includes(selectedAthlete.toLowerCase());
    });

    const filteredAttendanceLogs = sampleAttendanceLogs.filter(row => {
        if (selectedAthlete === 'ALL') return true;
        return row.athlete.toLowerCase().includes(selectedAthlete.toLowerCase());
    });

    // Real CSV Export Generator
    const handleDownloadCSV = () => {
        setIsGenerating(true);
        setTimeout(() => {
            let csvContent = "data:text/csv;charset=utf-8,";
            let filename = `OMNIFIT_Trainer_Report_${selectedReportType}_${timeframe}.csv`;

            if (selectedReportType === 'workout') {
                csvContent += "Date,Athlete,Routine Title,Exercise Name,Sets x Reps,Target Load,Status,Trainer Notes\r\n";
                filteredWorkoutLogs.forEach(row => {
                    csvContent += `"${row.date}","${row.athlete}","${row.routine}","${row.exercise}","${row.setsReps}","${row.load}","${row.status}","${row.notes}"\r\n`;
                });
            } else if (selectedReportType === 'attendance') {
                csvContent += "Date,Athlete,Check-In Time,Session Duration,Terminal Access,Facial Verification\r\n";
                filteredAttendanceLogs.forEach(row => {
                    csvContent += `"${row.date}","${row.athlete}","${row.time}","${row.session}","${row.terminal}","${row.status}"\r\n`;
                });
            } else {
                csvContent += "Date,Athlete,Metric Type,Starting,Current,Progress Delta,Status\r\n";
                csvContent += `"2026-10-23","Haines Jose","Body Weight (kg)","80.5","78.5","-2.0 kg","On Track"\r\n`;
                csvContent += `"2026-10-23","Sarah Jenkins","Body Weight (kg)","68.0","66.2","-1.8 kg","On Track"\r\n`;
            }

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setIsGenerating(false);
            setDownloadMsg({
                type: 'success',
                text: `Export Complete: ${filename} generated and saved to your downloads!`
            });
            setTimeout(() => setDownloadMsg(null), 5000);
        }, 600);
    };

    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // Dedicated PDF Export Generator (Direct File Download, No Window Print)
    const handleDownloadPDF = () => {
        setIsGeneratingPDF(true);
        setTimeout(() => {
            try {
                // Landscape A4 provides ideal table spacing for multi-column metrics
                const doc = new jsPDF({
                    orientation: 'landscape',
                    unit: 'pt',
                    format: 'a4'
                });

                const currentReport = reportOptions.find(r => r.id === selectedReportType) || reportOptions[0];
                const filename = `OMNIFIT_Trainer_Report_${selectedReportType}_${timeframe}.pdf`;
                const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                // 1. Top Decorative Brand Bar
                doc.setFillColor(229, 9, 20); // OMNIFIT Brand Red
                doc.rect(0, 0, doc.internal.pageSize.getWidth(), 8, 'F');

                // 2. Header Background Card
                doc.setFillColor(18, 18, 23); // Iron District Dark Charcoal
                doc.rect(0, 8, doc.internal.pageSize.getWidth(), 82, 'F');

                // 3. Header Titles
                doc.setTextColor(255, 30, 40);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(16);
                doc.text('OMNIFIT', 32, 38);

                doc.setTextColor(255, 255, 255);
                doc.setFontSize(12);
                doc.text(' | PERFORMANCE ANALYTICS & COACHING LOG', 105, 38);

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                doc.setTextColor(170, 170, 180);
                doc.text(`Official Report: ${currentReport.name}  |  Generated: ${dateStr}`, 32, 56);

                doc.text(`Supervising Trainer: Coach ${trainerName}  |  Target: ${selectedAthlete === 'ALL' ? 'All Assigned Athletes' : selectedAthlete}  |  Cycle: ${timeframe.toUpperCase()}`, 32, 72);

                // 4. Build Table Columns and Data
                let head = [];
                let body = [];

                if (selectedReportType === 'workout') {
                    head = [['Date', 'Athlete', 'Routine Title', 'Exercise', 'Sets x Reps', 'Target Load', 'Status', 'Trainer Notes']];
                    body = filteredWorkoutLogs.map(row => [
                        row.date,
                        row.athlete,
                        row.routine,
                        row.exercise,
                        row.setsReps,
                        row.load,
                        row.status,
                        row.notes
                    ]);
                } else if (selectedReportType === 'attendance') {
                    head = [['Date', 'Athlete', 'Check-In Time', 'Session Duration', 'Access Terminal', 'Verification Status']];
                    body = filteredAttendanceLogs.map(row => [
                        row.date,
                        row.athlete,
                        row.time,
                        row.session,
                        row.terminal,
                        row.status
                    ]);
                } else {
                    head = [['Date', 'Athlete', 'Biometric Metric', 'Starting', 'Current', 'Progress Delta', 'Status']];
                    body = [
                        ['2026-10-23', 'Haines Jose', 'Body Weight (kg)', '80.5 kg', '78.5 kg', '-2.0 kg', 'On Track'],
                        ['2026-10-23', 'Sarah Jenkins', 'Body Weight (kg)', '68.0 kg', '66.2 kg', '-1.8 kg', 'On Track'],
                        ['2026-10-22', 'Marcus Vance', 'Overhead Press (1RM)', '65.0 kg', '72.5 kg', '+7.5 kg', 'Overloading'],
                        ['2026-10-21', 'Alex Mercer', 'Bench Press (1RM)', '90.0 kg', '95.0 kg', '+5.0 kg', 'Overloading']
                    ];
                }

                // 5. Generate Styled Table
                const renderTable = typeof autoTable === 'function' ? autoTable : (autoTable?.default || doc.autoTable);
                renderTable(doc, {
                    startY: 105,
                    head: head,
                    body: body,
                    theme: 'striped',
                    headStyles: {
                        fillColor: [229, 9, 20],
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        fontSize: 9,
                        halign: 'left'
                    },
                    alternateRowStyles: {
                        fillColor: [248, 248, 252]
                    },
                    bodyStyles: {
                        fontSize: 8.5,
                        textColor: [35, 35, 45],
                        cellPadding: 6
                    },
                    styles: {
                        lineColor: [220, 220, 230],
                        lineWidth: 0.5
                    },
                    margin: { left: 32, right: 32, bottom: 40 },
                    didDrawPage: (data) => {
                        // Footer with Page Numbers & Watermark
                        const pageCount = doc.internal.getNumberOfPages();
                        doc.setFontSize(8);
                        doc.setTextColor(140, 140, 150);
                        doc.setFont('helvetica', 'normal');
                        const footerText = `OMNIFIT Verified Training Log  |  Confidential Coach & Member Record  |  Page ${data.pageNumber} of ${pageCount}`;
                        doc.text(footerText, 32, doc.internal.pageSize.getHeight() - 15);
                    }
                });

                // 6. Direct Save & Download
                doc.save(filename);

                setIsGeneratingPDF(false);
                setDownloadMsg({
                    type: 'success',
                    text: `Dedicated PDF Generated: ${filename} downloaded successfully!`
                });
                setTimeout(() => setDownloadMsg(null), 5000);
            } catch (err) {
                console.error('Failed to generate PDF:', err);
                setIsGeneratingPDF(false);
                setDownloadMsg({
                    type: 'error',
                    text: 'PDF Generation Error: ' + (err.message || 'Could not compile document.')
                });
            }
        }, 350);
    };

    return (
        <div className="space-y-6 animate-fade-in font-sans text-white">
            {/* Header Control Hub */}
            <div className="p-6 sm:p-8 bg-[#121217] border border-[#22222a] rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#E50914]/12 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/15 border border-[#E50914]/40 shadow-[0_0_12px_rgba(229,9,20,0.25)]">
                            <span className="w-2 h-2 rounded-full bg-[#FF1E28] animate-pulse shadow-[0_0_8px_#FF1E28]"></span>
                            <span className="text-[10px] font-black text-[#FF1E28] uppercase tracking-widest">
                                VERIFIED PERFORMANCE ANALYTICS
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            Trainer Report & Export Center
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                            Generate verifiable athlete workout logs, overload records, and facial attendance statements for Coach <strong className="text-white">{trainerName}</strong>.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            id="export-dedicated-pdf-btn"
                            type="button"
                            onClick={handleDownloadPDF}
                            disabled={isGeneratingPDF}
                            className="px-4 py-2.5 rounded-xl bg-[#181820] hover:bg-[#22222d] border border-[#2a2a38] hover:border-[#FF1E28]/50 text-zinc-200 hover:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-60"
                        >
                            {isGeneratingPDF ? (
                                <>
                                    <span className="spinner-border spinner-border-sm text-[#FF1E28]" role="status"></span>
                                    <span>Building PDF...</span>
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-file-earmark-pdf-fill text-sm text-[#FF1E28]"></i>
                                    <span>Export Dedicated PDF</span>
                                </>
                            )}
                        </button>
                        <button
                            id="download-csv-btn"
                            type="button"
                            onClick={handleDownloadCSV}
                            disabled={isGenerating}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B80710] hover:from-[#FF1E28] hover:to-[#E50914] text-white font-black text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(229,9,20,0.35)] transition-all cursor-pointer disabled:opacity-60"
                        >
                            {isGenerating ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                    <span>Exporting...</span>
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-file-earmark-spreadsheet-fill text-sm"></i>
                                    <span>Download CSV Report</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Toast Banner (Green Theme!) */}
            {downloadMsg && (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 font-bold flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.25)] animate-fade-in">
                    <div className="flex items-center gap-3">
                        <i className="bi bi-check-circle-fill text-emerald-400 text-lg"></i>
                        <span className="text-xs">{downloadMsg.text}</span>
                    </div>
                    <button
                        onClick={() => setDownloadMsg(null)}
                        className="text-emerald-400 hover:text-emerald-200 text-xs cursor-pointer"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            )}

            {/* Report Type Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportOptions.map((opt) => {
                    const isSelected = selectedReportType === opt.id;
                    return (
                        <div
                            key={opt.id}
                            onClick={() => setSelectedReportType(opt.id)}
                            className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                    ? 'bg-[#181820] border-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.25)]'
                                    : 'bg-[#121217] border-[#22222a] hover:border-[#2f2f3d]'
                            }`}
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div
                                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg"
                                        style={{ background: `${opt.color}20`, color: opt.color, border: `1px solid ${opt.color}40` }}
                                    >
                                        <i className={`bi ${opt.icon}`}></i>
                                    </div>
                                    {isSelected && (
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#E50914]/15 text-[#FF1E28] border border-[#E50914]/40">
                                            SELECTED
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-sm font-extrabold text-white tracking-tight">{opt.name}</h4>
                                <p className="text-xs text-zinc-400 leading-relaxed">{opt.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filters Bar: Target Athlete & Timeframe */}
            <div className="p-5 bg-[#121217] border border-[#22222a] rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                    <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                            Target Athlete Filter:
                        </label>
                        <select
                            value={selectedAthlete}
                            onChange={(e) => setSelectedAthlete(e.target.value)}
                            className="px-3.5 py-2 rounded-xl bg-[#181820] border border-[#2a2a38] text-white text-xs font-semibold focus:border-[#E50914] outline-none min-w-[200px]"
                        >
                            <option value="ALL">All Assigned Athletes</option>
                            {assignedAthletes.length === 0 ? (
                                <>
                                    <option value="Haines Jose">Haines Jose (hainesjosepaulson123@gmail.com)</option>
                                    <option value="Sarah Jenkins">Sarah Jenkins (sarah.jenkins@omnifit.com)</option>
                                    <option value="Alex Mercer">Alex Mercer (alex.mercer@omnifit.com)</option>
                                </>
                            ) : (
                                assignedAthletes.map(a => (
                                    <option key={a.id || a.email} value={a.name}>
                                        {a.name} ({a.email})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                            Timeframe:
                        </label>
                        <select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="px-3.5 py-2 rounded-xl bg-[#181820] border border-[#2a2a38] text-white text-xs font-semibold focus:border-[#E50914] outline-none"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days (Current Cycle)</option>
                            <option value="90d">Quarterly (90 Days)</option>
                            <option value="all">Full Academic / Membership Year</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Records Matched:</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#181820] border border-[#262634] text-white">
                        {selectedReportType === 'workout' ? filteredWorkoutLogs.length : filteredAttendanceLogs.length} Records
                    </span>
                </div>
            </div>

            {/* Live Report Preview Table */}
            <div className="p-6 bg-[#121217] border border-[#22222a] rounded-3xl shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1f1f28]">
                    <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E28]"></span>
                        <h4 className="text-base font-extrabold text-white tracking-tight">
                            Report Data Preview • {reportOptions.find(r => r.id === selectedReportType)?.name}
                        </h4>
                    </div>
                    <span className="text-xs text-zinc-400">Verifiable Audit Format</span>
                </div>

                <div className="overflow-x-auto">
                    {selectedReportType === 'workout' ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#1f1f28] text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                    <th className="pb-3 px-3">DATE</th>
                                    <th className="pb-3 px-3">ATHLETE</th>
                                    <th className="pb-3 px-3">ROUTINE TITLE</th>
                                    <th className="pb-3 px-3">EXERCISE</th>
                                    <th className="pb-3 px-3">SETS x REPS</th>
                                    <th className="pb-3 px-3">TARGET LOAD</th>
                                    <th className="pb-3 px-3">STATUS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1f1f28] text-xs">
                                {filteredWorkoutLogs.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-[#181820] transition-colors">
                                        <td className="py-3 px-3 text-zinc-400 font-semibold">{row.date}</td>
                                        <td className="py-3 px-3 font-bold text-white">{row.athlete}</td>
                                        <td className="py-3 px-3 text-zinc-300">{row.routine}</td>
                                        <td className="py-3 px-3 text-white font-semibold">{row.exercise}</td>
                                        <td className="py-3 px-3 text-zinc-400">{row.setsReps}</td>
                                        <td className="py-3 px-3 text-[#FF1E28] font-bold">{row.load}</td>
                                        <td className="py-3 px-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                row.status === 'Completed'
                                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                                                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#1f1f28] text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                    <th className="pb-3 px-3">DATE</th>
                                    <th className="pb-3 px-3">ATHLETE</th>
                                    <th className="pb-3 px-3">CHECK-IN TIME</th>
                                    <th className="pb-3 px-3">SESSION DURATION</th>
                                    <th className="pb-3 px-3">FACILITY TERMINAL</th>
                                    <th className="pb-3 px-3">STATUS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1f1f28] text-xs">
                                {filteredAttendanceLogs.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-[#181820] transition-colors">
                                        <td className="py-3 px-3 text-zinc-400 font-semibold">{row.date}</td>
                                        <td className="py-3 px-3 font-bold text-white">{row.athlete}</td>
                                        <td className="py-3 px-3 text-zinc-300">{row.time}</td>
                                        <td className="py-3 px-3 text-white font-semibold">{row.session}</td>
                                        <td className="py-3 px-3 text-zinc-400">{row.terminal}</td>
                                        <td className="py-3 px-3">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/40">
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportModule;
