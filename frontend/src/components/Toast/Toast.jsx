import React, { useEffect } from 'react';

const Toast = ({ show, message, type = 'info', onClose, duration = 4000 }) => {
    useEffect(() => {
        if (show && duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show) return null;

    const getTypeStyle = () => {
        switch (type) {
            case 'success':
                return { icon: 'bi-check-circle-fill', border: '#FFFFFF', color: '#FFFFFF', title: 'Success' };
            case 'error':
                return { icon: 'bi-exclamation-octagon-fill', border: '#ef4444', color: '#f87171', title: 'Error' };
            case 'warning':
                return { icon: 'bi-exclamation-triangle-fill', border: '#f59e0b', color: '#fbbf24', title: 'Warning' };
            default:
                return { icon: 'bi-info-circle-fill', border: '#3b82f6', color: '#60a5fa', title: 'Notification' };
        }
    };

    const style = getTypeStyle();

    return (
        <div
            className="toast-container position-fixed top-0 end-0 p-3"
            style={{ zIndex: 9999 }}
        >
            <div
                className="toast show align-items-center text-white border-0 shadow-lg animate-fade-in"
                style={{
                    background: 'rgba(17, 24, 39, 0.95)',
                    backdropFilter: 'blur(12px)',
                    borderLeft: `4px solid ${style.border}`,
                    borderRadius: '12px',
                    minWidth: '300px'
                }}
            >
                <div className="d-flex p-3 align-items-center">
                    <i className={`bi ${style.icon} fs-4 me-3`} style={{ color: style.color }}></i>
                    <div className="toast-body flex-grow-1 p-0">
                        <strong className="d-block" style={{ color: style.color, fontSize: '0.9rem' }}>{style.title}</strong>
                        <span className="small text-light">{message}</span>
                    </div>
                    <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        onClick={onClose}
                    ></button>
                </div>
            </div>
        </div>
    );
};

export default Toast;
