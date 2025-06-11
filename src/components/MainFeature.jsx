import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { skillService, matchService, sessionService } from '../services';

export default function MainFeature() {
  const [skills, setSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [activeTab, setActiveTab] = useState('offers');

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

  const handleSkillAction = async (skillId, action) => {
    try {
      if (action === 'match') {
        const newMatch = await matchService.create({
          skillId,
          teacherId: "current-user",
          learnerId: "matched-user",
          score: 0.85,
          status: 'pending'
        });
        setMatches(prev => [...prev, newMatch]);
        toast.success('Match request sent!');
      }
    } catch (err) {
      toast.error('Failed to process request');
    }
  };

  const handleSessionSchedule = async (matchId, sessionData) => {
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

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-xl p-6 shadow-sm"
          >
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-4 text-center">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  const filteredSkills = skills.filter(skill => skill.type === activeTab.slice(0, -1));

  return (
    <div className="max-w-full overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex bg-surface rounded-xl p-1 mb-6">
        {['offers', 'requests'].map(tab => (
          <motion.button
            key={tab}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            {tab === 'offers' ? 'Can Teach' : 'Want to Learn'}
          </motion.button>
        ))}
      </div>

      {/* Skills Grid */}
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
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="BookOpen" className="w-16 h-16 text-gray-300 mx-auto" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {activeTab === 'offers' ? 'No skills to teach yet' : 'No learning requests yet'}
              </h3>
              <p className="mt-2 text-gray-500">
                {activeTab === 'offers' 
                  ? 'Share your knowledge with neighbors' 
                  : 'Find skills you want to learn'
                }
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSkillForm(true)}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
              >
                {activeTab === 'offers' ? 'Add Skill to Teach' : 'Request to Learn'}
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface rounded-xl p-6 shadow-sm border border-surface-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 break-words">
                        {skill.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 break-words">
                        {skill.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <ApperIcon name="MapPin" size={14} className="mr-1" />
                        0.5 mi away
                      </span>
                      <span className="flex items-center">
                        <ApperIcon name="Star" size={14} className="mr-1 text-secondary" />
                        4.8
                      </span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSkillAction(skill.id, 'match')}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:brightness-110 transition-all flex items-center"
                    >
                      <ApperIcon name="Users" size={16} className="mr-2" />
                      Connect
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Matches Section */}
      {matches.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-heading text-gray-900 mb-4">Your Matches</h2>
          <div className="space-y-3">
            {matches.slice(0, 3).map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-accent/10 rounded-lg p-4 border border-accent/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Great match found!</p>
                      <p className="text-sm text-gray-600">
                        {Math.round(match.score * 100)}% compatibility
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSessionSchedule(match.id, {
                      datetime: new Date(),
                      location: 'Local Coffee Shop',
                      duration: 60
                    })}
                    className="px-3 py-1.5 bg-accent text-white rounded-lg text-sm font-medium hover:brightness-110"
                  >
                    Schedule
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Sessions Section */}
      {sessions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-heading text-gray-900 mb-4">Upcoming Sessions</h2>
          <div className="space-y-3">
            {sessions.slice(0, 3).map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-secondary/10 rounded-lg p-4 border border-secondary/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Session Scheduled</p>
                    <p className="text-sm text-gray-600">
                      {session.location} • {session.duration} minutes
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-secondary">
                      +{session.credits || 1} credits
                    </p>
                    <p className="text-xs text-gray-500">when completed</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowSkillForm(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-30"
      >
        <motion.div
          animate={{ rotate: showSkillForm ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="Plus" size={24} />
        </motion.div>
      </motion.button>
    </div>
  );
}