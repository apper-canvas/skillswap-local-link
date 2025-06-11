import React from 'react';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';

const ProfileInfoSection = ({ title, children, emptyMessage, emptyIconName, fallbackMessage }) => {
    return (
        <div className="bg-surface rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
            {children || (emptyMessage && emptyIconName ? (
                <EmptyState
                    iconName={emptyIconName}
                    title={emptyMessage}
                    message=""
                    className="py-8"
                >
                    <ApperIcon name={emptyIconName} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">{emptyMessage}</p>
                </EmptyState>
            ) : (
                <p className="text-gray-600 break-words">{fallbackMessage}</p>
            ))}
        </div>
    );
};

export default ProfileInfoSection;