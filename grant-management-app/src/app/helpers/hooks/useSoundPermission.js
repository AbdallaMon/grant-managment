"use client";
import {useEffect, useState} from 'react';

const useSoundPermission = () => {
    const [canPlaySound, setCanPlaySound] = useState(() => {
        return localStorage.getItem('canPlaySound') === 'true';
    });

    useEffect(() => {
        const handleInteraction = () => {
            setCanPlaySound(true);
            localStorage.setItem('canPlaySound', 'true');
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };

        // Only add event listeners if the permission hasn’t been granted
        if (!canPlaySound) {
            window.addEventListener('click', handleInteraction);
            window.addEventListener('keydown', handleInteraction);
        }

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [canPlaySound]);

    return canPlaySound;
};

export default useSoundPermission;
