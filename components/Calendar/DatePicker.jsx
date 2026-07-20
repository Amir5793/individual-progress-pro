// components/DatePicker/DatePicker.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from "@/lib/i18n/localeContext";

const DatePicker = ({ onDateSelect, initialDate = null, placeholder }) => {
    const t = useTranslation();
    const parsedInitialDate = useMemo(() => {
        return initialDate ? new Date(initialDate) : null;
    }, [initialDate]);

    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(parsedInitialDate ?? new Date());
    const pickerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

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

    const handleDateSelect = (day) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        setViewDate(newDate);
        setIsOpen(false);
        if (onDateSelect) {
            onDateSelect(newDate);
        }
    };

    const isToday = (day) => {
        const today = new Date();
        return (
            today.getFullYear() === viewDate.getFullYear() &&
            today.getMonth() === viewDate.getMonth() &&
            today.getDate() === day
        );
    };

    const isSelected = (day) => {
        if (!parsedInitialDate) return false;
        return (
            parsedInitialDate.getFullYear() === viewDate.getFullYear() &&
            parsedInitialDate.getMonth() === viewDate.getMonth() &&
            parsedInitialDate.getDate() === day
        );
    };

    const formatDate = (date) => {
        if (!date) return placeholder ?? t('datepicker.placeholder');
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const renderDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="emptyDay" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isTodayDate = isToday(day);
            const isSelectedDate = isSelected(day);
            days.push(
                <button
                    key={day}
                    className={`day ${isTodayDate ? 'today' : ''} ${isSelectedDate ? 'selected' : ''}`}
                    onClick={() => handleDateSelect(day)}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    const monthNames = t('datepicker.months').split(',');

    const dayNames = t('datepicker.days_short').split(',');

    return (
        <StyledWrapper className="datePicker" ref={pickerRef}>
            <button
                className={`triggerButton ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <span className="triggerIcon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                </span>
                <span className="triggerText">
                    {formatDate(parsedInitialDate)}
                </span>
                <span className="triggerArrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div className="calendarContainer">
                    <div className="calendarHeader">
                        <div className="monthYear">
                            <button className="navButton" onClick={goToPreviousYear} aria-label={t('datepicker.prev_year')} type="button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                    <polyline points="19 18 13 12 19 6" />
                                </svg>
                            </button>
                            <button className="navButton" onClick={goToPreviousMonth} aria-label={t('datepicker.prev_month')} type="button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                            <span className="monthYearText">
                                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                            </span>
                            <button className="navButton" onClick={goToNextMonth} aria-label={t('datepicker.next_month')} type="button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                            <button className="navButton" onClick={goToNextYear} aria-label={t('datepicker.next_year')} type="button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                    <polyline points="5 18 11 12 5 6" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="dayNames">
                        {dayNames.map((name) => (
                            <div key={name} className="dayName">{name}</div>
                        ))}
                    </div>

                    <div className="daysGrid">
                        {renderDays()}
                    </div>

                    <div className="calendarFooter">
                        <button className="todayButton" onClick={() => {
                            const today = new Date();
                            setViewDate(today);
                            handleDateSelect(today.getDate());
                        }} type="button">
                            {t('datepicker.today')}
                        </button>
                        {parsedInitialDate && (
                            <button className="clearButton" onClick={() => {
                                if (onDateSelect) {
                                    onDateSelect(null);
                                }
                                setIsOpen(false);
                            }} type="button">
                                {t('datepicker.clear')}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </StyledWrapper>
    );
};

export default DatePicker;

const StyledWrapper = styled.div`
  position: relative;
  display: inline-block;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  width: 280px;

  .triggerButton {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 16px;
    background: #0D0D0D;
    color: #F0F0F0;
    border: 2px solid #3A3A3A;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    gap: 10px;
  }

  .triggerButton:hover {
    border-color: #6A1B9A;
    background: #1A1A1A;
  }

  .triggerButton.open {
    border-color: #AB47BC;
    box-shadow: 0 0 0 3px rgba(106, 27, 154, 0.4);
  }

  .triggerIcon {
    display: flex;
    align-items: center;
    color: #AB47BC;
    flex-shrink: 0;
  }

  .triggerText {
    flex: 1;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .triggerText:empty::before {
    content: attr(data-placeholder);
    color: #B0B0B0;
  }

  .triggerArrow {
    display: flex;
    align-items: center;
    color: #B0B0B0;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  .triggerButton.open .triggerArrow {
    transform: rotate(180deg);
    color: #AB47BC;
  }

  .calendarContainer {
    position: absolute;
    top: calc(5vh + 10px);
    left: 0;
    width: 100%;
    min-width: 280px;
    background: #1A1A1A;
    border: 1px solid #3A3A3A;
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);
    padding: 16px;
    z-index: 1000;
    backdrop-filter: blur(4px);
    animation: slideDown 0.2s ease-out;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .calendarHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .monthYear {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    justify-content: space-between;
  }

  .navButton {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    border-radius: 50%;
    color: #B0B0B0;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0;
    flex-shrink: 0;
  }

  .navButton:hover {
    background: #2A2A2A;
    color: #F0F0F0;
  }

  .navButton:active {
    transform: scale(0.92);
  }

  .monthYearText {
    font-weight: 600;
    font-size: 1rem;
    color: #F0F0F0;
    letter-spacing: 0.3px;
    flex: 1;
    text-align: center;
  }

  .dayNames {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 8px;
  }

  .dayName {
    text-align: center;
    font-size: 0.7rem;
    font-weight: 600;
    color: #B0B0B0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 4px 0;
  }

  .daysGrid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }

  .emptyDay {
    visibility: hidden;
    pointer-events: none;
  }

  .day {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1 / 1;
    width: 100%;
    background: transparent;
    border: none;
    border-radius: 8px;
    font-size: 0.85rem;
    color: #F0F0F0;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 400;
    position: relative;
  }

  .day:hover {
    background: #2A2A2A;
    color: white;
  }

  .day:active {
    transform: scale(0.92);
  }

  .day.today {
    font-weight: 600;
    color: #AB47BC;
  }

  .day.today::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #AB47BC;
  }

  .day.selected {
    background: #6A1B9A;
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(106, 27, 154, 0.4);
  }

  .day.selected:hover {
    background: #4A148C;
  }

  .day.selected.today::after {
    background: white;
  }

  .calendarFooter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid #3A3A3A;
  }

  .todayButton,
  .clearButton {
    background: transparent;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
    color: #B0B0B0;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .todayButton:hover,
  .clearButton:hover {
    background: #2A2A2A;
    color: #F0F0F0;
  }

  .clearButton {
    color: #EF5350;
  }

  .clearButton:hover {
    background: rgba(239, 83, 80, 0.15);
    color: #FF8A80;
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;

    .calendarContainer {
      left: calc(-50vw + 25%);
    }
  }
`;
