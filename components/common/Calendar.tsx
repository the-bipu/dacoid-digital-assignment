import React, { useState } from 'react';
import { Button } from '../ui/button';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // this get the days in the current month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // this one get the start day of the month
    const getStartDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    // this one generates the calendar days
    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const daysInMonth = getDaysInMonth(year, month);
        const startDay = getStartDayOfMonth(year, month);

        const calendarDays = [];

        // Add blank days for previous month
        for (let i = 0; i < startDay; i++) {
            calendarDays.push(null);
        }

        // Add days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            calendarDays.push(day);
        }

        return calendarDays;
    };

    // simple navigation functions to handle next and previous month navigation
    const handlePrevMonth = () => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const calendarDays = generateCalendarDays();

    return (
        <div className="w-full h-full text-center">
            <div className="flex justify-between items-center mb-4 gap-4">
                <Button onClick={handlePrevMonth} variant={'default'}>Previous</Button>
                <h2 className="text-xl font-bold">
                    {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <Button onClick={handleNextMonth} variant={'default'}>Next</Button>
            </div>
            <div className="grid grid-cols-7 gap-2">

                {/* Render days of the week */}
                {daysOfWeek.map((day, index) => (
                    <div key={index} className="font-bold text-gray-700">
                        {day}
                    </div>
                ))}

                {/* Render the calendar days */}
                {calendarDays.map((day, index) => (
                    <div
                        key={index}
                        className={`h-20 p-2 flex items-center justify-center border rounded text-2xl text-center ${day ? 'bg-white' : 'bg-gray-100'}`}
                    >
                        {day}
                    </div>
                ))}
                
            </div>
        </div>
    );
};

export default Calendar;