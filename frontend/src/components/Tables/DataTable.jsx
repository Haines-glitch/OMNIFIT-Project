import React, { useState } from 'react';

const DataTable = ({ title, columns, data, onExportPDF, onExportExcel, theme = 'dark' }) => {
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
                    <div className="w-full bg-[#181822] border border-[#272736] rounded-full h-2 overflow-hidden p-[1px]">
                        <div
                            className="bg-gradient-to-r from-[#E50914] to-[#FF1E28] h-full rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${numericVal}%` }}
                        ></div>
                    </div>
                    <span className="text-xs font-bold text-[#FF1E28] font-mono min-w-[36px]">{val}</span>
                </div>
            );
        }

        return <span className="text-zinc-200 text-sm font-medium">{val}</span>;
    };

    return (
        <div className="p-6 bg-[#121217]/90 backdrop-blur-xl border border-[#1f1f28] shadow-xl shadow-black/40 rounded-2xl transition-all">
            {/* Header controls & Export */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h5 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]"></span>
                        {title}
                    </h5>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 sm:flex-initial">
                        <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></i>
                        <input
                            type="text"
                            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-[#14141a] border border-[#22222d] text-white placeholder-zinc-500 focus:border-red-500/60 rounded-xl text-xs focus:outline-none focus:ring-1 transition-all"
                            placeholder="Search table..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Export PDF Button */}
                    {onExportPDF && (
                        <button
                            className="px-3 py-2 bg-[#14141a] hover:bg-zinc-800 border border-[#22222d] text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                            onClick={onExportPDF}
                        >
                            <i className="bi bi-file-earmark-pdf text-[#FF1E28]"></i> PDF
                        </button>
                    )}

                    {/* Export Excel Button */}
                    {onExportExcel && (
                        <button
                            className="px-3 py-2 bg-[#14141a] hover:bg-zinc-800 border border-[#22222d] text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                            onClick={onExportExcel}
                        >
                            <i className="bi bi-file-earmark-excel text-emerald-500"></i> Excel
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#1f1f28] text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
                            {columns.map((col) => (
                                <th key={col.key} className="pb-3.5 px-3">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f1f28]/60">
                        {filteredData.length > 0 ? (
                            filteredData.map((row, index) => (
                                <tr key={index} className="hover:bg-zinc-800/40 transition-colors group">
                                    {columns.map((col) => (
                                        <td key={col.key} className="py-4 px-3 align-middle">
                                            {renderCellContent(col, row)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-8 text-zinc-500 text-sm">
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

