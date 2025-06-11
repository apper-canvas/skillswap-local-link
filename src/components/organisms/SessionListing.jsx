import React from 'react';
import SessionCard from '@/components/molecules/SessionCard';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const SessionListing = ({ sessions, onCompleteSession, onCancelSession, loading, error }) => {
    if (loading) {
        return (
            <LoadingSkeleton count={3}>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </LoadingSkeleton>
        );
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    const filteredSessions = sessions.filter(session => session.status !== 'cancelled');

    if (filteredSessions.length === 0) {
        return (
            <EmptyState
                iconName="Calendar"
                title="No sessions scheduled"
                message="Connect with neighbors to schedule skill exchanges"
            >
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                >
                    <ApperIcon name="Calendar" className="w-16 h-16 text-gray-300 mx-auto" />
                </motion.div>
            </EmptyState>
        );
    }

    return (
        <div className="space-y-4">
            {filteredSessions
                .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                .map((session, index) => (
                    <SessionCard
                        key={session.id}
                        session={session}
                        index={index}
                        onComplete={onCompleteSession}
                        onCancel={onCancelSession}
                    />
                ))}
        </div>
    );
};

export default SessionListing;