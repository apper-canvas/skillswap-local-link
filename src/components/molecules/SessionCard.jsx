import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const SessionCard = ({ session, index, onComplete, onCancel }) => {
    const isCompleted = session.status === 'completed';
    const isScheduled = session.status === 'scheduled';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface rounded-xl p-6 shadow-sm border border-surface-200 max-w-full overflow-hidden"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Skill Exchange Session</h4>
                        <Badge
                            className={
                                isCompleted
                                    ? 'bg-green-100 text-green-800'
                                    : isScheduled
                                    ? 'bg-secondary/20 text-secondary'
                                    : 'bg-gray-100 text-gray-600'
                            }
                        >
                            {session.status}
                        </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                            <ApperIcon name="Calendar" size={14} className="mr-2" />
                            {format(new Date(session.datetime), 'EEEE, MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center">
                            <ApperIcon name="Clock" size={14} className="mr-2" />
                            {format(new Date(session.datetime), 'h:mm a')} • {session.duration} minutes
                        </div>
                        <div className="flex items-center">
                            <ApperIcon name="MapPin" size={14} className="mr-2" />
                            {session.location}
                        </div>
                        <div className="flex items-center">
                            <ApperIcon name="Coins" size={14} className="mr-2 text-secondary" />
                            {session.credits || 1} credits
                        </div>
                    </div>
                </div>
            </div>

            {isScheduled && (
                <div className="flex space-x-2">
                    <Button
                        onClick={() => onComplete(session.id)}
                        className="flex-1 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:brightness-110 transition-all"
                    >
                        Mark Complete
                    </Button>
                    <Button
                        onClick={() => onCancel(session.id)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export default SessionCard;