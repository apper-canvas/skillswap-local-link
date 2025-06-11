import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import PageHeader from '@/components/organisms/PageHeader';
import TabButton from '@/components/molecules/TabButton';
import ActionIconButton from '@/components/molecules/ActionIconButton';
import CalendarWeekDisplay from '@/components/organisms/CalendarWeekDisplay';
import SessionListing from '@/components/organisms/SessionListing';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import ErrorState from '@/components/molecules/ErrorState';
import { sessionService } from '@/services';

export default function CalendarPage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [view, setView] = useState('week'); // 'week' or 'month' - only 'week' is implemented as per original

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await sessionService.getAll();
            setSessions(data);
        } catch (err) {
            setError(err.message || 'Failed to load sessions');
            toast.error('Failed to load calendar');
        } finally {
            setLoading(false);
        }
    };

    const getWeekDays = () => {
        const start = startOfWeek(currentWeek, { weekStartsOn: 0 });
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    };

    const getSessionsForDay = (day) => {
        return sessions.filter(session =>
            isSameDay(new Date(session.datetime), day)
        );
    };

    const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
    const prevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));

    const handleSessionAction = async (sessionId, action) => {
        try {
            if (action === 'complete') {
                const updatedSession = await sessionService.update(sessionId, {
                    status: 'completed'
                });
                setSessions(prev => prev.map(session =>
                    session.id === sessionId ? updatedSession : session
                ));
                toast.success('Session marked as completed! Credits have been added.');
            } else if (action === 'cancel') {
                await sessionService.delete(sessionId);
                setSessions(prev => prev.filter(session => session.id !== sessionId));
                toast.success('Session cancelled successfully.');
            }
        } catch (err) {
            toast.error(`Failed to ${action} session`);
        }
    };

    if (loading) {
        return (
            <div className="h-full bg-background">
                <div className="bg-white border-b border-surface-200 px-4 py-6">
                    <LoadingSkeleton>
                        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </LoadingSkeleton>
                </div>
                <div className="p-4">
                    <LoadingSkeleton count={1}>
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className="h-20 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </LoadingSkeleton>
                </div>
            </div>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={loadSessions} />;
    }

    const weekDays = getWeekDays();

    return (
        <div className="min-h-full bg-background">
            <PageHeader
                title="Calendar"
                subtitle="Your skill exchange sessions"
                rightContent={
                    <div className="flex bg-surface rounded-lg p-1">
                        {['week', 'month'].map(viewType => (
                            <TabButton
                                key={viewType}
                                label={viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                                isActive={view === viewType}
                                onClick={() => setView(viewType)}
                                className="px-3 py-1.5"
                            />
                        ))}
                    </div>
                }
            />

            <div className="bg-white border-b border-surface-200 px-4 py-4"> {/* Adjusted for calendar header below main header */}
                <div className="flex items-center justify-between">
                    <ActionIconButton iconName="ChevronLeft" onClick={prevWeek} />

                    <h2 className="text-lg font-semibold text-gray-900">
                        {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
                    </h2>

                    <ActionIconButton iconName="ChevronRight" onClick={nextWeek} />
                </div>
            </div>

            <div className="p-4">
                <CalendarWeekDisplay weekDays={weekDays} getSessionsForDay={getSessionsForDay} />

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
                <SessionListing
                    sessions={sessions}
                    onCompleteSession={(id) => handleSessionAction(id, 'complete')}
                    onCancelSession={(id) => handleSessionAction(id, 'cancel')}
                    loading={loading}
                    error={error}
                />
            </div>
        </div>
    );
}