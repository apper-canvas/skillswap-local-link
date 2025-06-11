import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const MatchCard = ({ match, index, onAccept, onSchedule }) => {
    const isPending = match.status === 'pending';
    const isScheduled = match.status === 'accepted'; // or 'scheduled' if applicable

    return (
        <motion.div
            key={match.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-accent/10 rounded-xl p-6 border border-accent/20"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                        <ApperIcon name="User" size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">
                            {match.title || 'Great match found!'} {/* Assuming match might have a title or default */}
                        </p>
                        <p className="text-sm text-gray-600">
                            {Math.round(match.score * 100)}% compatibility match
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Status: {match.status}
                        </p>
                    </div>
                </div>
                {isPending && (
                    <Button
                        onClick={() => onAccept(match.id)}
                        className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:brightness-110"
                    >
                        Accept
                    </Button>
                )}
                {isScheduled && onSchedule && (
                    <Button
                        onClick={() => onSchedule(match.id, {
                            datetime: new Date(),
                            location: 'Local Coffee Shop',
                            duration: 60
                        })}
                        className="px-3 py-1.5 bg-accent text-white rounded-lg text-sm font-medium hover:brightness-110"
                    >
                        Schedule
                    </Button>
                )}
            </div>
        </motion.div>
    );
};

export default MatchCard;