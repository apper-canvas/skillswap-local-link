import React from 'react';

const PageHeader = ({ title, subtitle, rightContent, className = '' }) => {
    return (
        <div className={`bg-white border-b border-surface-200 px-4 py-6 ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading text-gray-900">{title}</h1>
                    <p className="text-gray-600">{subtitle}</p>
                </div>
                {rightContent}
            </div>
        </div>
    );
};

export default PageHeader;