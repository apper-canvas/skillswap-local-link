import React from 'react';
import SkillCard from '@/components/molecules/SkillCard';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';

const SkillListing = ({ skills, onConnect, loading, error, onRetry, searchTerm, selectedCategory }) => {
    if (loading) {
        return (
            <LoadingSkeleton count={4}>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex justify-between items-center mt-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
            </LoadingSkeleton>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={onRetry} />;
    }

    if (skills.length === 0) {
        return (
            <EmptyState
                iconName="Search"
                title="No skills found"
                message={
                    searchTerm || selectedCategory !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'Be the first to share a skill in your neighborhood'
                }
            />
        );
    }

    return (
        <div className="space-y-4">
            {skills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} onConnect={onConnect} />
            ))}
        </div>
    );
};

export default SkillListing;