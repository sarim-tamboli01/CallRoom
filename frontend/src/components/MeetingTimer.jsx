import React, { useState, useEffect } from 'react';

export default function MeetingTimer({ startTime }) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!startTime) return;
        
        const interval = setInterval(() => {
            const now = Date.now();
            const diff = Math.floor((now - startTime) / 1000);
            setElapsed(diff);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <span style={{ 
            color: '#fff', 
            fontSize: '0.9rem',
            fontWeight: 500,
            background: 'rgba(0,0,0,0.5)',
            padding: '4px 12px',
            borderRadius: '20px'
        }}>
            {formatTime(elapsed)}
        </span>
    );
}

