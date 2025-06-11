import React from 'react';

const ProfileStatItem = ({ value, label, valueClassName = 'text-primary' }) => {
    return (
        <div className="text-center">
            <div className={`text-2xl font-bold ${valueClassName}`}>{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
        </div>
    );
};

export default ProfileStatItem;