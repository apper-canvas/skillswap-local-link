import React from 'react';
import MatchCard from '@/components/molecules/MatchCard';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const MatchListing = ({ matches, onAcceptMatch, onScheduleMatch, loading, error }) => {
    if (loading) {
        return (
            <LoadingSkeleton count={3}>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </LoadingSkeleton>
        );
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    if (matches.length === 0) {
        return (
            <EmptyState
                iconName="Users"
                title="No matches yet"
                message="Add skills to start getting matched with neighbors"
            >
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                >
                    <ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto" />
                </motion.div>
            </EmptyState>
        );
    }

    return (
        <div className="space-y-4">
            {matches.map((match, index) => (
                <MatchCard
                    key={match.id}
                    match={match}
                    index={index}
                    onAccept={onAcceptMatch}
                    onSchedule={onScheduleMatch}
                />
            ))}
        </div>
    );
};

export default MatchListing;