import React from 'react';
import SearchInput from '@/components/molecules/SearchInput';
import TabButton from '@/components/molecules/TabButton';
import CategoryButton from '@/components/molecules/CategoryButton';

const SkillFilterBar = ({
    searchTerm,
    onSearchChange,
    skillType,
    onSkillTypeChange,
    selectedCategory,
    onCategoryChange,
    categories
}) => {
    return (
        <div className="space-y-6">
            <SearchInput
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Search skills..."
            />

            <div className="flex bg-surface rounded-xl p-1">
                {[
                    { id: 'all', label: 'All' },
                    { id: 'offer', label: 'Can Teach' },
                    { id: 'request', label: 'Want to Learn' }
                ].map(type => (
                    <TabButton
                        key={type.id}
                        label={type.label}
                        isActive={skillType === type.id}
                        onClick={() => onSkillTypeChange(type.id)}
                    />
                ))}
            </div>

            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Categories</h2>
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(category => (
                        <CategoryButton
                            key={category.id}
                            category={category}
                            isSelected={selectedCategory === category.id}
                            onClick={() => onCategoryChange(category.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkillFilterBar;