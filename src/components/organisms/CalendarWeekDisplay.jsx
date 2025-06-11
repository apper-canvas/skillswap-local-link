import React from 'react';
import { motion } from 'framer-motion';
import { format, isSameDay } from 'date-fns';

const CalendarWeekDisplay = ({ weekDays, getSessionsForDay }) => {
    return (
        <div className="grid grid-cols-7 gap-2 mb-6">
            {weekDays.map((day, index) => {
                const daysSessions = getSessionsForDay(day);
                const isToday = isSameDay(day, new Date());

                return (
                    <motion.div
                        key={day.toISOString()}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`min-h-24 p-2 rounded-lg border transition-all ${
                            isToday
                                ? 'bg-primary/5 border-primary/30'
                                : 'bg-surface border-surface-200 hover:bg-surface-100'
                        }`}
                    >
                        <div className="text-center mb-2">
                            <div className="text-xs font-medium text-gray-500 uppercase">
                                {format(day, 'EEE')}
                            </div>
                            <div className={`text-lg font-semibold ${
                                isToday ? 'text-primary' : 'text-gray-900'
                            }`}>
                                {format(day, 'd')}
                            </div>
                        </div>

                        <div className="space-y-1">
                            {daysSessions.map((session, sessionIndex) => (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: sessionIndex * 0.1 }}
                                    className={`text-xs p-1.5 rounded text-center font-medium cursor-pointer transition-all ${
                                        session.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : session.status === 'cancelled'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-secondary/20 text-secondary hover:bg-secondary/30'
                                    }`}
                                >
                                    {format(new Date(session.datetime), 'HH:mm')}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default CalendarWeekDisplay;