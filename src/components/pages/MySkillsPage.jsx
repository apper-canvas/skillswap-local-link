import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { skillService, matchService } from '@/services';
import PageHeader from '@/components/organisms/PageHeader';
import TabButton from '@/components/molecules/TabButton';
import MySkillCard from '@/components/molecules/MySkillCard';
import MatchCard from '@/components/molecules/MatchCard';
import AddSkillForm from '@/components/organisms/AddSkillForm';
import Modal from '@/components/organisms/Modal';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import ErrorState from '@/components/molecules/ErrorState';
import FloatingActionButton from '@/components/molecules/FloatingActionButton';


export default function MySkillsPage() {
    const [skills, setSkills] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('my-skills');
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [skillForm, setSkillForm] = useState({
        title: '',
        description: '',
        category: 'tech',
        type: 'offer',
        level: 'beginner'
    });

    const categories = [
        { id: 'music', name: 'Music' },
        { id: 'tech', name: 'Technology' },
        { id: 'cooking', name: 'Cooking' },
        { id: 'fitness', name: 'Fitness' },
        { id: 'art', name: 'Art & Craft' },
        { id: 'language', name: 'Languages' }
    ];

    const levels = [
        { id: 'beginner', name: 'Beginner' },
        { id: 'intermediate', name: 'Intermediate' },
        { id: 'advanced', name: 'Advanced' },
        { id: 'expert', name: 'Expert' }
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [skillsData, matchesData] = await Promise.all([
                skillService.getAll(),
                matchService.getAll()
            ]);
            setSkills(skillsData);
            setMatches(matchesData);
        } catch (err) {
            setError(err.message || 'Failed to load data');
            toast.error('Failed to load your skills');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSkill = async (e) => {
        e.preventDefault();
        try {
            const newSkill = await skillService.create({
                ...skillForm,
                userId: 'current-user',
                availability: ['weekends', 'evenings']
            });
            setSkills(prev => [...prev, newSkill]);
            setShowSkillForm(false);
            setSkillForm({
                title: '',
                description: '',
                category: 'tech',
                type: 'offer',
                level: 'beginner'
            });
            toast.success('Skill added successfully!');
        } catch (err) {
            toast.error('Failed to add skill');
        }
    };

    const handleDeleteSkill = async (skillId) => {
        try {
            await skillService.delete(skillId);
            setSkills(prev => prev.filter(skill => skill.id !== skillId));
            toast.success('Skill removed successfully!');
        } catch (err) {
            toast.error('Failed to remove skill');
        }
    };

    const handleAcceptMatch = async (matchId) => {
        try {
            const updatedMatch = await matchService.update(matchId, { status: 'accepted' });
            setMatches(prev => prev.map(match =>
                match.id === matchId ? updatedMatch : match
            ));
            toast.success('Match accepted! You can now schedule a session.');
        } catch (err) {
            toast.error('Failed to accept match');
        }
    };

    if (loading) {
        return (
            <div className="p-4 space-y-4">
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                <LoadingSkeleton count={3}>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </LoadingSkeleton>
            </div>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={loadData} />;
    }

    return (
        <div className="min-h-full bg-background">
            <PageHeader
                title="My Skills"
                subtitle="Manage your skills and matches"
            />

            <div className="p-4">
                <div className="flex bg-surface rounded-xl p-1 mb-6">
                    {[
                        { id: 'my-skills', label: 'My Skills' },
                        { id: 'matches', label: 'Matches' }
                    ].map(tab => (
                        <TabButton
                            key={tab.id}
                            label={tab.label}
                            isActive={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'my-skills' && (
                        <motion.div
                            key="my-skills"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            {skills.length === 0 ? (
                                <EmptyState
                                    iconName="BookOpen"
                                    title="No skills added yet"
                                    message="Share your knowledge or learning goals with neighbors"
                                    actionText="Add Your First Skill"
                                    onActionClick={() => setShowSkillForm(true)}
                                />
                            ) : (
                                skills.map((skill, index) => (
                                    <MySkillCard
                                        key={skill.id}
                                        skill={skill}
                                        index={index}
                                        onDelete={handleDeleteSkill}
                                    />
                                ))
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'matches' && (
                        <motion.div
                            key="matches"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            {matches.length === 0 ? (
                                <EmptyState
                                    iconName="Users"
                                    title="No matches yet"
                                    message="Add skills to start getting matched with neighbors"
                                />
                            ) : (
                                matches.map((match, index) => (
                                    <MatchCard
                                        key={match.id}
                                        match={match}
                                        index={index}
                                        onAccept={handleAcceptMatch}
                                    />
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <FloatingActionButton onClick={() => setShowSkillForm(true)} showForm={showSkillForm} />

            <Modal isOpen={showSkillForm} onClose={() => setShowSkillForm(false)} title="Add New Skill">
                <AddSkillForm
                    skillForm={skillForm}
                    categories={categories}
                    levels={levels}
                    onChange={setSkillForm}
                    onSubmit={handleCreateSkill}
                    onCancel={() => setShowSkillForm(false)}
                />
            </Modal>
        </div>
    );
}