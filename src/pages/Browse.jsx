import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { skillService } from '../services';

export default function Browse() {
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

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {/* Search skeleton */}
        <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        
        {/* Categories skeleton */}
        <div className="flex space-x-2 overflow-x-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>

        {/* Skills skeleton */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-xl p-6 shadow-sm"
          >
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="flex justify-between items-center mt-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 px-4 py-6">
        <h1 className="text-2xl font-heading text-gray-900 mb-1">Discover Skills</h1>
        <p className="text-gray-600">Find neighbors to learn from or teach</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <ApperIcon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Skill Type Toggle */}
        <div className="flex bg-surface rounded-xl p-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'offer', label: 'Can Teach' },
            { id: 'request', label: 'Want to Learn' }
          ].map(type => (
            <motion.button
              key={type.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSkillType(type.id)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                skillType === type.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              {type.label}
            </motion.button>
          ))}
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Categories</h2>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <motion.button
                key={category.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-surface text-gray-700 hover:bg-surface-200'
                }`}
              >
                <ApperIcon name={category.icon} size={16} />
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Skills List */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-4 text-center">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadSkills}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
            >
              Try Again
            </motion.button>
          </div>
        ) : filteredSkills.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No skills found</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to share a skill in your neighborhood'
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface rounded-xl p-6 shadow-sm border border-surface-200 hover:shadow-md transition-all max-w-full overflow-hidden"
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
                    <p className="text-gray-600 text-sm break-words">
                      {skill.description}
                    </p>
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
                    <span className="flex items-center">
                      <ApperIcon name="Clock" size={14} className="mr-1" />
                      {skill.level}
                    </span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleConnect(skill.id)}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:brightness-110 transition-all flex items-center"
                  >
                    <ApperIcon name="MessageCircle" size={16} className="mr-2" />
                    Connect
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}