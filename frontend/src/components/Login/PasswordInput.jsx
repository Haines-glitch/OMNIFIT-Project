import React, { useState } from 'react';

const PasswordInput = ({ value, onChange, placeholder = "Enter your password", required = true, name = "password" }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);

    const handleKeyUp = (e) => {
        if (e.getModifierState) {
            setIsCapsLockOn(e.getModifierState('CapsLock'));
        }
    };

    const handleKeyDown = (e) => {
        if (e.getModifierState) {
            setIsCapsLockOn(e.getModifierState('CapsLock'));
        }
    };

    // Helper for password strength calculation
    const getPasswordStrength = (pass) => {
        if (!pass) return { text: '', color: '', percent: 0 };
        let score = 0;
        if (pass.length >= 6) score += 25;
        if (pass.length >= 10) score += 25;
        if (/[A-Z]/.test(pass)) score += 25;
        if (/[0-9!@#$%^&*]/.test(pass)) score += 25;

        if (score <= 25) return { text: 'Weak', color: '#ef4444', percent: 25 };
        if (score <= 50) return { text: 'Fair', color: '#f59e0b', percent: 50 };
        if (score <= 75) return { text: 'Good', color: '#9ca3af', percent: 75 };
        return { text: 'Strong', color: '#FFFFFF', percent: 100 };
    };

    const strength = getPasswordStrength(value);

    return (
        <div className="password-input-wrapper mb-3 position-relative">
            <label className="form-label text-light fw-medium d-flex justify-content-between">
                <span><i className="bi bi-lock-fill text-white me-2"></i>Password</span>
                {value && (
                    <span className="small text-muted" style={{ fontSize: '0.8rem' }}>
                        Strength: <strong style={{ color: strength.color }}>{strength.text}</strong>
                    </span>
                )}
            </label>

            <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-muted">
                    <i className="bi bi-key-fill text-white"></i>
                </span>
                <input
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    className="form-control bg-dark text-white border-secondary"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onKeyUp={handleKeyUp}
                    onKeyDown={handleKeyDown}
                    required={required}
                    autoComplete="current-password"
                />
                <button
                    type="button"
                    className="btn btn-outline-secondary text-light px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                >
                    <i className={`bi ${showPassword ? 'bi-eye-slash-fill text-white' : 'bi-eye-fill'}`}></i>
                </button>
            </div>

            {/* Password Strength Indicator Bar */}
            {value && (
                <div className="progress mt-1" style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <div
                        className="progress-bar transition-all"
                        role="progressbar"
                        style={{
                            width: `${strength.percent}%`,
                            backgroundColor: strength.color,
                            transition: 'width 0.3s ease'
                        }}
                    ></div>
                </div>
            )}

            {/* Caps Lock Warning Banner */}
            {isCapsLockOn && (
                <div className="caps-warning text-warning mt-1 d-flex align-items-center gap-1 small animate-fade-in" style={{ fontSize: '0.8rem' }}>
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <span><strong>Caps Lock is ON!</strong> Check capitalization before logging in.</span>
                </div>
            )}
        </div>
    );
};

export default PasswordInput;
