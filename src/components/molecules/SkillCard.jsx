import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const SkillCard = ({ skill, index, onConnect }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface rounded-xl p-6 shadow-sm border border-surface-200 hover:shadow-md transition-all max-w-full overflow-hidden"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 break-words">
                            {skill.title}
                        </h3>
                        <Badge
                            className={
                                skill.type === 'offer'
                                    ? 'bg-secondary/20 text-secondary'
                                    : 'bg-accent/20 text-accent'
                            }
                        >
                            {skill.type === 'offer' ? 'Teaching' : 'Learning'}
                        </Badge>
                    </div>
                    <p className="text-gray-600 text-sm break-words">
                        {skill.description}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                        <ApperIcon name="MapPin" size={14} className="mr-1" />
                        0.5 mi away
                    </span>
                    <span className="flex items-center">
                        <ApperIcon name="Star" size={14} className="mr-1 text-secondary" />
                        4.8
                    </span>
                    <span className="flex items-center">
                        <ApperIcon name="Clock" size={14} className="mr-1" />
                        {skill.level}
                    </span>
                </div>

                <Button
                    onClick={() => onConnect(skill.id)}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:brightness-110 transition-all flex items-center"
                >
                    <ApperIcon name="MessageCircle" size={16} className="mr-2" />
                    Connect
                </Button>
            </div>
        </motion.div>
    );
};

export default SkillCard;