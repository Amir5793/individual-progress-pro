// components/DatePicker/DatePicker.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './DatePicker.module.css';

const DatePicker = ({ onDateSelect, initialDate = null, placeholder = 'Select date' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(initialDate ? new Date(initialDate) : null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date());
    const pickerRef = useRef(null);

    // Sync with initialDate prop
    useEffect(() => {
        if (initialDate) {
            const date = new Date(initialDate);
            setSelectedDate(date);
            setViewDate(date);
            setCurrentMonth(date);
        }
    }, [initialDate]);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Navigate months
    const goToPreviousMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const goToPreviousYear = () => {
        setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
    };

    const goToNextYear = () => {
        setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
    };

    // Handle date selection
    const handleDateSelect = (day) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        setSelectedDate(newDate);
        setCurrentMonth(newDate);
        setIsOpen(false);
        if (onDateSelect) {
            onDateSelect(newDate);
        }
    };

    // Check if a date is today
    const isToday = (day) => {
        const today = new Date();
        return (
            today.getFullYear() === viewDate.getFullYear() &&
            today.getMonth() === viewDate.getMonth() &&
            today.getDate() === day
        );
    };

    // Check if a date is selected
    const isSelected = (day) => {
        if (!selectedDate) return false;
        return (
            selectedDate.getFullYear() === viewDate.getFullYear() &&
            selectedDate.getMonth() === viewDate.getMonth() &&
            selectedDate.getDate() === day
        );
    };

    // Format date for display
    const formatDate = (date) => {
        if (!date) return placeholder;
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Render calendar days
    const renderDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Empty cells for days before the first day of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isTodayDate = isToday(day);
            const isSelectedDate = isSelected(day);
            days.push(
                <button
                    key={day}
                    className={`${styles.day} ${isTodayDate ? styles.today : ''} ${isSelectedDate ? styles.selected : ''}`}
                    onClick={() => handleDateSelect(day)}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    // Month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Day names (short)
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <div className={styles.datePicker} ref={pickerRef}>
            {/* Trigger Button */}
            <button
                className={`${styles.triggerButton} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <span className={styles.triggerIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                </span>
                <span className={styles.triggerText}>
                    {formatDate(selectedDate)}
                </span>
                <span className={styles.triggerArrow}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            {/* Calendar Dropdown */}
            {isOpen && (
                <div className={styles.calendarContainer}>
                    {/* Header */}
                    <div className={styles.calendarHeader}>
                        <div className={styles.monthYear}>
                            <button
                                className={styles.navButton}
                                onClick={goToPreviousYear}
                                aria-label="Previous year"
                                type="button"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                    <polyline points="19 18 13 12 19 6" />
                                </svg>
                            </button>
                            <button
                                className={styles.navButton}
                                onClick={goToPreviousMonth}
                                aria-label="Previous month"
                                type="button"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                            <span className={styles.monthYearText}>
                                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                            </span>
                            <button
                                className={styles.navButton}
                                onClick={goToNextMonth}
                                aria-label="Next month"
                                type="button"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                            <button
                                className={styles.navButton}
                                onClick={goToNextYear}
                                aria-label="Next year"
                                type="button"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                    <polyline points="5 18 11 12 5 6" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Day Names */}
                    <div className={styles.dayNames}>
                        {dayNames.map((name) => (
                            <div key={name} className={styles.dayName}>
                                {name}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className={styles.daysGrid}>
                        {renderDays()}
                    </div>

                    {/* Footer with today button */}
                    <div className={styles.calendarFooter}>
                        <button
                            className={styles.todayButton}
                            onClick={() => {
                                const today = new Date();
                                setViewDate(today);
                                setCurrentMonth(today);
                                handleDateSelect(today.getDate());
                            }}
                            type="button"
                        >
                            Today
                        </button>
                        {selectedDate && (
                            <button
                                className={styles.clearButton}
                                onClick={() => {
                                    setSelectedDate(null);
                                    if (onDateSelect) {
                                        onDateSelect(null);
                                    }
                                    setIsOpen(false);
                                }}
                                type="button"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;