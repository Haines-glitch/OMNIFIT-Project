import React from 'react';

const roles = [
    { id: 'member', title: 'Member', icon: 'bi-person-badge-fill', desc: 'Workout & Diet' },
    { id: 'trainer', title: 'Trainer', icon: 'bi-lightning-charge-fill', desc: 'Coach & Clients' },
    { id: 'admin', title: 'Admin', icon: 'bi-shield-lock-fill', desc: 'Ecosystem Control' }
];

const RoleSelector = ({ selectedRole, onSelectRole }) => {
    return (
        <div className="role-selector-container mb-4">
            <label className="form-label text-light fw-medium d-block mb-2">
                <i className="bi bi-person-gear text-white me-2"></i>Select Access Role
            </label>
            <div className="row g-2">
                {roles.map((role) => {
                    const isSelected = selectedRole === role.id;
                    return (
                        <div key={role.id} className="col-4">
                            <div
                                className={`role-card text-center p-2 rounded-3 cursor-pointer transition-all ${isSelected ? 'role-card-active' : 'role-card-inactive'
                                    }`}
                                onClick={() => onSelectRole(role.id)}
                                style={{
                                    background: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(31, 41, 55, 0.4)',
                                    border: isSelected ? '2px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: isSelected ? '0 0 15px rgba(255, 255, 255, 0.3)' : 'none',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }}
                            >
                                <div className={`icon-wrapper mb-1 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                                    <i className={`bi ${role.icon} fs-4`}></i>
                                </div>
                                <div className={`fw-bold small ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                                    {role.title}
                                </div>
                                <div className={isSelected ? 'text-zinc-200' : 'text-zinc-400'} style={{ fontSize: '0.68rem' }}>
                                    {role.desc}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RoleSelector;
