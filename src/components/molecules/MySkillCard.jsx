import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const MySkillCard = ({ skill, index, onDelete }) => {
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
                    <p className="text-gray-600 text-sm break-words mb-2">
                        {skill.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{skill.category}</span>
                        <span>{skill.level}</span>
                    </div>
                </div>
                <Button
                    onClick={() => onDelete(skill.id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <ApperIcon name="Trash2" size={16} />
                </Button>
            </div>
        </motion.div>
    );
};

export default MySkillCard;