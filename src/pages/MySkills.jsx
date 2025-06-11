import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { skillService, matchService } from '../services';

export default function MySkills() {
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
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface rounded-xl p-6 shadow-sm">
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 px-4 py-6">
        <h1 className="text-2xl font-heading text-gray-900 mb-1">My Skills</h1>
        <p className="text-gray-600">Manage your skills and matches</p>
      </div>

      <div className="p-4">
        {/* Tab Navigation */}
        <div className="flex bg-surface rounded-xl p-1 mb-6">
          {[
            { id: 'my-skills', label: 'My Skills' },
            { id: 'matches', label: 'Matches' }
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              {tab.label}
            </motion.button>
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
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No skills added yet</h3>
                  <p className="mt-2 text-gray-500">Share your knowledge or learning goals with neighbors</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSkillForm(true)}
                    className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
                  >
                    Add Your First Skill
                  </motion.button>
                </motion.div>
              ) : (
                skills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-surface rounded-xl p-6 shadow-sm border border-surface-200 max-w-full overflow-hidden"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 break-words">
                            {skill.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            skill.type === 'offer' 
                              ? 'bg-secondary/20 text-secondary' 
                              : 'bg-accent/20 text-accent'
                          }`}>
                            {skill.type === 'offer' ? 'Teaching' : 'Learning'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm break-words mb-2">
                          {skill.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{skill.category}</span>
                          <span>{skill.level}</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
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
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto" />
                  </motion.div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No matches yet</h3>
                  <p className="mt-2 text-gray-500">Add skills to start getting matched with neighbors</p>
                </motion.div>
              ) : (
                matches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-accent/10 rounded-xl p-6 border border-accent/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                          <ApperIcon name="User" size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Sarah M.</p>
                          <p className="text-sm text-gray-600">
                            {Math.round(match.score * 100)}% compatibility match
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Status: {match.status}
                          </p>
                        </div>
                      </div>
                      {match.status === 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAcceptMatch(match.id)}
                          className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:brightness-110"
                        >
                          Accept
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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

      {/* Skill Form Modal */}
      <AnimatePresence>
        {showSkillForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowSkillForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading text-gray-900">Add New Skill</h2>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSkillForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" size={20} />
                  </motion.button>
                </div>

                <form onSubmit={handleCreateSkill} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skill Title
                    </label>
                    <input
                      type="text"
                      required
                      value={skillForm.title}
                      onChange={(e) => setSkillForm({...skillForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="e.g., Guitar lessons, Python programming"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      value={skillForm.description}
                      onChange={(e) => setSkillForm({...skillForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      rows="3"
                      placeholder="Describe what you can teach or want to learn..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <select
                        value={skillForm.type}
                        onChange={(e) => setSkillForm({...skillForm, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="offer">Can Teach</option>
                        <option value="request">Want to Learn</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level
                      </label>
                      <select
                        value={skillForm.level}
                        onChange={(e) => setSkillForm({...skillForm, level: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        {levels.map(level => (
                          <option key={level.id} value={level.id}>{level.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={skillForm.category}
                      onChange={(e) => setSkillForm({...skillForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowSkillForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
                    >
                      Add Skill
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}