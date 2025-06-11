import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { userService, sessionService, ratingService } from '../services';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const [userData, sessionsData, ratingsData] = await Promise.all([
        userService.getById('current-user'),
        sessionService.getAll(),
        ratingService.getAll()
      ]);
      
      setUser(userData);
      setSessions(sessionsData);
      setRatings(ratingsData);
      setEditForm({
        name: userData.name,
        bio: userData.bio,
        location: userData.location
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await userService.update('current-user', editForm);
      setUser(updatedUser);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const completedSessions = sessions.filter(s => s.status === 'completed');
  const totalCreditsEarned = completedSessions.reduce((sum, s) => sum + (s.credits || 1), 0);
  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
    : 0;

  if (loading) {
    return (
      <div className="h-full bg-background">
        <div className="bg-white border-b border-surface-200 px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface rounded-xl p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-4 text-center">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadProfile}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      {/* Profile Header */}
      <div className="bg-white border-b border-surface-200 px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={28} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                <ApperIcon name="Star" size={12} className="text-white" />
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-heading text-gray-900">{user.name}</h1>
              <p className="text-gray-600 flex items-center">
                <ApperIcon name="MapPin" size={14} className="mr-1" />
                {user.location || 'Location not set'}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditMode(true)}
            className="p-2 text-gray-400 hover:text-primary transition-colors"
          >
            <ApperIcon name="Edit2" size={20} />
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{totalCreditsEarned}</div>
            <div className="text-xs text-gray-500">Credits Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{completedSessions.length}</div>
            <div className="text-xs text-gray-500">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {averageRating > 0 ? averageRating.toFixed(1) : '—'}
            </div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Bio Section */}
        <div className="bg-surface rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
          <p className="text-gray-600 break-words">
            {user.bio || 'No bio added yet. Share something about yourself and your skills!'}
          </p>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          
          {completedSessions.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Activity" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No completed sessions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedSessions.slice(0, 5).map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-surface-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <ApperIcon name="CheckCircle" size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Session Completed</p>
                      <p className="text-xs text-gray-500">{session.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-secondary font-medium text-sm">+{session.credits || 1}</p>
                    <p className="text-xs text-gray-500">credits</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-surface rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h2>
          
          {ratings.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Star" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.slice(0, 3).map((rating, index) => (
                <motion.div
                  key={rating.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg border border-surface-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <ApperIcon
                          key={i}
                          name="Star"
                          size={14}
                          className={i < rating.rating ? 'text-secondary' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">Anonymous</span>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-gray-600 break-words">{rating.comment}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Account Settings */}
        <div className="bg-surface rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Member since</span>
              <span className="text-gray-900 font-medium">
                {new Date(user.joinDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Credit Balance</span>
              <span className="text-secondary font-bold">{user.credits}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editMode && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setEditMode(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading text-gray-900">Edit Profile</h2>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditMode(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </motion.button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    rows="3"
                    placeholder="Tell neighbors about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Your neighborhood or city"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditMode(false)}
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
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}