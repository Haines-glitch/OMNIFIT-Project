import React, { useState } from 'react';

const DataTable = ({ title, columns, data, onExportPDF, onExportExcel, theme = 'light' }) => {
    const isLight = theme === 'light';
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = (data || []).filter((row) =>
        Object.values(row).some(
            (val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const renderCellContent = (col, row) => {
        if (col.render) {
            return col.render(row[col.key], row);
        }

        const val = row[col.key];

        // Sleek progress bar rendering for attendance %
        if (col.key === 'attendance' && typeof val === 'string' && val.includes('%')) {
            const numericVal = parseInt(val, 10) || 0;
            return (
                <div className="flex items-center gap-3 min-w-[120px]">
                    <div className={`w-full ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700/60'} rounded-full h-2 overflow-hidden border p-[1px]`}>
                        <div
                            className="bg-gradient-to-r from-[#10B981] to-[#00F29D] h-full rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${numericVal}%` }}
                        ></div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 font-mono min-w-[36px]">{val}</span>
                </div>
            );
        }

        return <span className={`${isLight ? 'text-slate-800' : 'text-slate-200'} text-sm font-medium`}>{val}</span>;
    };

    return (
        <div className={`p-6 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 backdrop-blur-xl border-slate-800/80 shadow-xl shadow-black/40'} border rounded-2xl transition-all`}>
            {/* Header controls & Export */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h5 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'} tracking-tight flex items-center gap-2`}>
                        <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]"></span>
                        {title}
                    </h5>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 sm:flex-initial">
                        <i className={`bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-400'} text-sm`}></i>
                        <input
                            type="text"
                            className={`w-full sm:w-64 pl-10 pr-4 py-2 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500' : 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500 focus:border-[#00F29D]/60'} border rounded-xl text-xs focus:outline-none focus:ring-1 transition-all`}
                            placeholder="Search table..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Export PDF Button */}
                    {onExportPDF && (
                        <button
                            className={`px-3 py-2 ${isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'} border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all`}
                            onClick={onExportPDF}
                        >
                            <i className="bi bi-file-earmark-pdf text-red-500"></i> PDF
                        </button>
                    )}

                    {/* Export Excel Button */}
                    {onExportExcel && (
                        <button
                            className={`px-3 py-2 ${isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'} border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all`}
                            onClick={onExportExcel}
                        >
                            <i className="bi bi-file-earmark-excel text-emerald-600"></i> Excel
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className={`border-b ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-400'} text-[11px] font-bold uppercase tracking-wider`}>
                            {columns.map((col) => (
                                <th key={col.key} className="pb-3.5 px-3">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800/50'}`}>
                        {filteredData.length > 0 ? (
                            filteredData.map((row, index) => (
                                <tr key={index} className={`${isLight ? 'hover:bg-slate-50/80' : 'hover:bg-slate-800/40'} transition-colors group`}>
                                    {columns.map((col) => (
                                        <td key={col.key} className="py-4 px-3 align-middle">
                                            {renderCellContent(col, row)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className={`text-center py-8 ${isLight ? 'text-slate-400' : 'text-slate-500'} text-sm`}>
                                    No records found matching filter criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;

