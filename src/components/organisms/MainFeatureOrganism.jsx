import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { skillService, matchService, sessionService } from '@/services';
import TabButton from '@/components/molecules/TabButton';
import SkillCard from '@/components/molecules/SkillCard';
import MatchCard from '@/components/molecules/MatchCard';
import SessionCard from '@/components/molecules/SessionCard';
import AddSkillForm from '@/components/organisms/AddSkillForm';
import Modal from '@/components/organisms/Modal';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';

const MainFeatureOrganism = () => {
    const [skills, setSkills] = useState([]);
    const [matches, setMatches] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [activeTab, setActiveTab] = useState('offers');
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
            const [skillsData, matchesData, sessionsData] = await Promise.all([
                skillService.getAll(),
                matchService.getAll(),
                sessionService.getAll()
            ]);
            setSkills(skillsData);
            setMatches(matchesData);
            setSessions(sessionsData);
        } catch (err) {
            setError(err.message || 'Failed to load data');
            toast.error('Failed to load skill data');
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (skillId) => {
        try {
            const newMatch = await matchService.create({
                skillId,
                teacherId: "current-user",
                learnerId: "matched-user",
                score: 0.85,
                status: 'pending'
            });
            setMatches(prev => [...prev, newMatch]);
            toast.success('Match request sent!');
        } catch (err) {
            toast.error('Failed to send match request');
        }
    };

    const handleScheduleSession = async (matchId, sessionData) => {
        try {
            const newSession = await sessionService.create({
                matchId,
                ...sessionData,
                status: 'scheduled'
            });
            setSessions(prev => [...prev, newSession]);
            toast.success('Session scheduled successfully!');
        } catch (err) {
            toast.error('Failed to schedule session');
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

    if (loading) {
        return (
            <LoadingSkeleton count={3}>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </LoadingSkeleton>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={loadData} />;
    }

    const filteredSkills = skills.filter(skill => skill.type === activeTab.slice(0, -1));

    return (
        <div className="max-w-full overflow-hidden">
            <div className="flex bg-surface rounded-xl p-1 mb-6">
                {['offers', 'requests'].map(tab => (
                    <TabButton
                        key={tab}
                        label={tab === 'offers' ? 'Can Teach' : 'Want to Learn'}
                        isActive={activeTab === tab}
                        onClick={() => setActiveTab(tab)}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
                    {filteredSkills.length === 0 ? (
                        <EmptyState
                            iconName="BookOpen"
                            title={activeTab === 'offers' ? 'No skills to teach yet' : 'No learning requests yet'}
                            message={
                                activeTab === 'offers'
                                    ? 'Share your knowledge with neighbors'
                                    : 'Find skills you want to learn'
                            }
                            actionText={activeTab === 'offers' ? 'Add Skill to Teach' : 'Request to Learn'}
                            onActionClick={() => setShowSkillForm(true)}
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredSkills.map((skill, index) => (
                                <SkillCard key={skill.id} skill={skill} index={index} onConnect={handleConnect} />
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {matches.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-heading text-gray-900 mb-4">Your Matches</h2>
                    <div className="space-y-3">
                        {matches.slice(0, 3).map((match, index) => (
                            <MatchCard
                                key={match.id}
                                match={match}
                                index={index}
                                onAccept={() => { /* In MainFeature, matches are just displayed/scheduled, not 'accepted' in the same way as MySkills */ }}
                                onSchedule={handleScheduleSession}
                            />
                        ))}
                    </div>
                </div>
            )}

            {sessions.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-heading text-gray-900 mb-4">Upcoming Sessions</h2>
                    <div className="space-y-3">
                        {sessions.slice(0, 3).map((session, index) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                index={index}
                                onComplete={() => { /* No actions in MainFeature */ }}
                                onCancel={() => { /* No actions in MainFeature */ }}
                            />
                        ))}
                    </div>
                </div>
            )}

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
};

export default MainFeatureOrganism;