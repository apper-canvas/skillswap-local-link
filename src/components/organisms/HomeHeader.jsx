import React from 'react';
import PageHeader from './PageHeader';

const HomeHeader = ({ credits }) => {
    const RightContent = (
        <div className="flex items-center space-x-2 text-sm">
            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{credits}</span>
            </div>
            <span className="text-gray-600">credits</span>
        </div>
    );

    return (
        <PageHeader
            title={<span className="text-primary">SkillSwap Local</span>}
            subtitle="Connect, Learn, Teach with neighbors"
            rightContent={RightContent}
        />
    );
};

export default HomeHeader;