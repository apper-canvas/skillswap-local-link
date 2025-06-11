import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProfileStatItem from '@/components/molecules/ProfileStatItem';

const ProfileHeaderSection = ({ user, onEditProfile, totalCreditsEarned, completedSessionsCount, averageRating }) => {
    if (!user) return null;

    return (
        <div className="bg-white border-b border-surface-200 px-4 py-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                            <ApperIcon name="User" size={28} className="text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                            <ApperIcon name="Star" size={12} className="text-white" />
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-heading text-gray-900">{user.name}</h1>
                        <p className="text-gray-600 flex items-center">
                            <ApperIcon name="MapPin" size={14} className="mr-1" />
                            {user.location || 'Location not set'}
                        </p>
                    </div>
                </div>

                <Button
                    onClick={onEditProfile}
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                >
                    <ApperIcon name="Edit2" size={20} />
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <ProfileStatItem
                    value={totalCreditsEarned}
                    label="Credits Earned"
                    valueClassName="text-secondary"
                />
                <ProfileStatItem
                    value={completedSessionsCount}
                    label="Sessions"
                    valueClassName="text-accent"
                />
                <ProfileStatItem
                    value={averageRating > 0 ? averageRating.toFixed(1) : '—'}
                    label="Rating"
                    valueClassName="text-primary"
                />
            </div>
        </div>
    );
};

export default ProfileHeaderSection;