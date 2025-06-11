import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { skillService } from '@/services';
import PageHeader from '@/components/organisms/PageHeader';
import SkillFilterBar from '@/components/organisms/SkillFilterBar';
import SkillListing from '@/components/organisms/SkillListing';

export default function BrowsePage() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [skillType, setSkillType] = useState('all');

    const categories = [
        { id: 'all', name: 'All Skills', icon: 'Grid3x3' },
        { id: 'music', name: 'Music', icon: 'Music' },
        { id: 'tech', name: 'Technology', icon: 'Code' },
        { id: 'cooking', name: 'Cooking', icon: 'ChefHat' },
        { id: 'fitness', name: 'Fitness', icon: 'Dumbbell' },
        { id: 'art', name: 'Art & Craft', icon: 'Palette' },
        { id: 'language', name: 'Languages', icon: 'MessageSquare' }
    ];

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await skillService.getAll();
            setSkills(data);
        } catch (err) {
            setError(err.message || 'Failed to load skills');
            toast.error('Failed to load skills');
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (skillId) => {
        toast.success('Connection request sent!');
    };

    const filteredSkills = skills.filter(skill => {
        const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            skill.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
        const matchesType = skillType === 'all' || skill.type === skillType;

        return matchesSearch && matchesCategory && matchesType;
    });

    return (
        <div className="min-h-full bg-background">
            <PageHeader
                title="Discover Skills"
                subtitle="Find neighbors to learn from or teach"
            />
            <div className="p-4 space-y-6">
                <SkillFilterBar
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    skillType={skillType}
                    onSkillTypeChange={setSkillType}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    categories={categories}
                />
                <SkillListing
                    skills={filteredSkills}
                    onConnect={handleConnect}
                    loading={loading}
                    error={error}
                    onRetry={loadSkills}
                    searchTerm={searchTerm}
                    selectedCategory={selectedCategory}
                />
            </div>
        </div>
    );
}