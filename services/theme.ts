
import HomeContext from '@/pages/api/home/home.context';

import { useState, useEffect } from 'react';

export const changeTheme = (homeDispatch: any, theme: string): boolean => {
    if ('system-default' == theme) {
        const isLightTheme = window.matchMedia('(prefers-color-scheme: light)').matches;
        const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isLightTheme) {
            homeDispatch({
                field: 'lightMode',
                value: 'light',
            });
        }
        if (isDarkTheme) {
            homeDispatch({
                field: 'lightMode',
                value: 'dark',
            });
        }
    } else {
        homeDispatch({
            field: 'lightMode',
            value: theme,
        });
    }

    return true
}

export function enableAutoTheme(homeDispatch: any) {
    useEffect(() => {
        const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');

        /**
         * @param {MediaQueryListEvent} event
         */
        const listener = (event) => {
            console.log("change theme to ", event.matches)
            if (event.matches) {
                changeTheme(homeDispatch, 'dark');
            } else {
                changeTheme(homeDispatch, 'light');
            }
        };

        isDarkTheme.addEventListener('change', listener);

        return () => {
            isDarkTheme.removeEventListener('change', listener);
        };
    }, []);
}